
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, User, Clock, Bus, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function TrackingPage() {
  const mockTrackingData = {
    busId: 'SB-101',
    driverName: 'Mr. David Lee',
    driverContact: '555-0102',
    eta: '7 minutes',
    currentLocation: 'Approaching Elm Street',
    lastUpdate: new Date().toLocaleTimeString(),
    nextStop: 'Oakwood Elementary',
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">Real-Time Bus Tracking</h1>
        <p className="text-muted-foreground">Stay updated on your child's school bus location and ETA.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-xl h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            <CardContent className="h-full p-0">
              {/* Placeholder for map integration */}
              <div className="bg-gray-200 h-full flex items-center justify-center">
                 <Image 
                    src="https://placehold.co/800x500.png" 
                    alt="Live GPS map showing bus route and current location" 
                    width={800} 
                    height={500} 
                    className="object-cover w-full h-full"
                    data-ai-hint="city route"
                  />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Bus className="mr-2 h-5 w-5 text-primary" /> Bus Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem icon={ShieldCheck} label="Bus ID" value={mockTrackingData.busId} />
              <InfoItem icon={MapPin} label="Current Location" value={mockTrackingData.currentLocation} />
              <InfoItem icon={Clock} label="Estimated Time of Arrival (ETA)" value={mockTrackingData.eta} />
              <InfoItem icon={MapPin} label="Next Stop" value={mockTrackingData.nextStop} />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" /> Driver Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem icon={User} label="Driver Name" value={mockTrackingData.driverName} />
              <InfoItem icon={User} label="Contact (Emergency)" value={mockTrackingData.driverContact} />
            </CardContent>
          </Card>
           <Card className="shadow-lg bg-accent text-accent-foreground">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Clock className="mr-2 h-5 w-5" /> Last Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{mockTrackingData.lastUpdate}</p>
              <p className="text-sm opacity-80">Tracking data refreshes automatically.</p>
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
