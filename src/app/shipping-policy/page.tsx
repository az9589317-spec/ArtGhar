
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Shipping Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
            <p>For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.</p>
            <p>For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only.</p>
            <p>Orders are shipped within 1-2 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.</p>
            <p>JUPITER BANIA is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 1-2 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.</p>
            <p>Delivery of all orders will be to the address provided by the buyer.</p>
            <p>Delivery of our services will be confirmed on your mail ID as specified during registration. For any issues in utilizing our services you may contact our helpdesk on 6001102901 or jupiterbania472@gmail.com</p>
        </CardContent>
      </Card>
    </div>
  );
}
