import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs";
import { supabase, BUCKET_NAME } from "./supabase";

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const memoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("الصورة يجب أن تكون بصيغة JPEG, PNG, GIF, أو WebP"));
  }
};

export const upload = multer({
  storage: supabase ? memoryStorage : diskStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

export async function uploadToSupabase(file: Express.Multer.File): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const fileName = `${randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`فشل رفع الصورة: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export const useSupabaseStorage = !!supabase;
