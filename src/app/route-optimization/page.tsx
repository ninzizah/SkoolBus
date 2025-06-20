
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Route } from 'lucide-react';
import RouteOptimizationClient from '@/components/route-optimization-client';
import Image from 'next/image';

export default function RouteOptimizationPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center md:justify-start">
          <Route className="mr-3 h-8 w-8" /> Ubwenge mu Kunoza Ingendo
        </h1>
        <p className="text-muted-foreground mt-2">
          Koresha ubwenge bw'ubukorano kugira ngo ubone ibyifuzo by'izindi nzira cyangwa impinduka kuri gahunda zishingiye ku makuru y'ako kanya y'imihanda.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <RouteOptimizationClient />
        </div>
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Uko Bikora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>1. Tanga Amakuru:</strong> Tanga urugendo rw'imodoka rusanzwe, amakuru y'imihanda ako kanya, na gahunda ihari.</p>
              <p><strong>2. Isesengura ry'Ubwenge bw'Ubukorano:</strong> Modeli yacu y'ubwenge bw'ubukorano isesengura aya makuru kugira ngo imenye aho hashobora kubaho gukererwa.</p>
              <p><strong>3. Bona Ibyifuzo:</strong> Yakira urugendo runoze, impinduka kuri gahunda, n'ibisobanuro byumvikana byo kugabanya gukererwa.</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="AI isesengura ingendo" 
                width={600} 
                height={400} 
                className="rounded-lg object-cover"
                data-ai-hint="AI data abstract" 
              />
            </CardContent>
          </Card>
           <Card className="shadow-lg bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="font-headline">Akamaro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>✓ Kugabanya gukererwa no kunoza kugera ku gihe.</p>
              <p>✓ Kuzigama lisansi.</p>
              <p>✓ Kongera ibyishimo by'ababyeyi n'abanyeshuri.</p>
              <p>✓ Guhangana n'ibibazo by'imihanda mbere y'igihe.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
