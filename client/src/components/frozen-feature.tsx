import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FrozenFeature({ featureName }: { featureName: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
          <div className="rounded-full bg-muted p-4">
            <Lock className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold" data-testid="text-frozen-title">
            ميزة مجمّدة
          </h2>
          <p className="text-muted-foreground" data-testid="text-frozen-description">
            ميزة "{featureName}" مجمّدة حالياً ولا يمكن الوصول إليها.
            تواصل مع المبرمج لإزالة التجميد.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
