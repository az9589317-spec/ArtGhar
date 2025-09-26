
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactUsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
            <p>You may contact us using the information below:</p>
            <p>
                <strong>Merchant Legal entity name:</strong> JUPITER BANIA<br />
                <strong>Registered Address:</strong> Ledo Kalpara Tinsukia ASSAM 786182<br />
                <strong>Telephone No:</strong> 6001102901<br />
                <strong>E-Mail ID:</strong> jupiterbania472@gmail.com
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
