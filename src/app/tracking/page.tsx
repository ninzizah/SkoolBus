
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, User, Clock, Bus, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function TrackingPage() {
  const mockTrackingData = {
    busId: 'SB-101 (RAD 123B)',
    driverName: 'Makuza Jean',
    driverContact: '(+250) 788123456',
    eta: 'iminota 7',
    currentLocation: 'Yegereje Umuhanda wa KG 201 St',
    lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    nextStop: 'Groupe Scolaire Kacyiru',
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">Gukurikirana Imodoka Ako kanya</h1>
        <p className="text-muted-foreground">Menya aho imodoka y'ishuri y'umwana wawe iherereye n'igihe isigaje ngo igere.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-xl h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            <CardContent className="h-full p-0">
                 <Image 
                    src="https://placehold.co/800x500.png" 
                    alt="Ikarita ya GPS yerekana inzira y'imodoka n'aho iherereye ako kanya" 
                    width={800} 
                    height={500} 
                    className="object-cover w-full h-full"
                    data-ai-hint="umujyi ikarita"
                  />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Bus className="mr-2 h-5 w-5 text-primary" /> Amakuru y'Imodoka
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem icon={ShieldCheck} label="Nomero y'Imodoka" value={mockTrackingData.busId} />
              <InfoItem icon={MapPin} label="Aho Iherereye Ubu" value={mockTrackingData.currentLocation} />
              <InfoItem icon={Clock} label="Igihe Giteganijwe Cyasigaye (ETA)" value={mockTrackingData.eta} />
              <InfoItem icon={MapPin} label="Aho Ihagarara Hakurikira" value={mockTrackingData.nextStop} />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" /> Amakuru y'Umushoferi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem icon={User} label="Izina ry'Umushoferi" value={mockTrackingData.driverName} />
              <InfoItem icon={User} label="Telefoni (Mpamagaze byihutirwa)" value={mockTrackingData.driverContact} />
            </CardContent>
          </Card>
           <Card className="shadow-lg bg-accent text-accent-foreground">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Clock className="mr-2 h-5 w-5" /> Igihe Biherukira Kuvugururwa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{mockTrackingData.lastUpdate}</p>
              <p className="text-sm opacity-80">Amakuru yo gukurikirana yivugurura ako kanya.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start">
      <Icon className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
