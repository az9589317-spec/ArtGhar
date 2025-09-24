import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminArtistsPage() {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Artists</CardTitle>
          <Button>Add Artist</Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Artist management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
