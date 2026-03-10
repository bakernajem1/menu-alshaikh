import app, { routesReady } from '../server/app';

export default async function handler(req: any, res: any) {
  await routesReady;
  return app(req, res);
}
