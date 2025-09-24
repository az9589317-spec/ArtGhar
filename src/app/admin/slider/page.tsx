import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminSliderPage() {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Homepage Slider</CardTitle>
          <Button>Update Slider</Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Slider management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
