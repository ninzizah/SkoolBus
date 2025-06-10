import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Smile, MapPin, Gauge, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    title: 'Parent Accounts',
    description: 'Manage parent profiles, book rides, and view history.',
    href: '/parents',
    icon: Users,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    imgHint: 'family using tablet'
  },
  {
    title: 'Child Profiles',
    description: 'Add and manage children\'s details for safe transport.',
    href: '/children',
    icon: Smile,
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    imgHint: 'happy children school'
  },
  {
    title: 'Real-Time Tracking',
    description: 'Track bus location, ETA, and driver information live.',
    href: '/tracking',
    icon: MapPin,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    imgHint: 'map navigation city'
  },
  {
    title: 'Driver Dashboard',
    description: 'View routes, manage stops, and mark attendance.',
    href: '/driver',
    icon: Gauge,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    imgHint: 'bus driver smiling'
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary">
          Welcome to RouteRider
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
          The all-in-one platform for safe and reliable school transportation. Manage bookings, track rides, and optimize routes effortlessly.
        </p>
        <Image 
          src="https://placehold.co/1200x400.png" 
          alt="School bus illustration" 
          width={1200} 
          height={400} 
          className="rounded-lg shadow-xl mx-auto mb-12"
          data-ai-hint="school bus children" 
        />
        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/parents">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      <section className="py-12 md:py-16">
        <h2 className="text-3xl font-bold font-headline text-center mb-12 text-primary">
          Core Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="items-center text-center">
                <div className={`p-4 rounded-full ${feature.bgColor} mb-4`}>
                  <feature.icon className={`h-10 w-10 ${feature.textColor}`} />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0 mt-auto text-center">
                <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
                  <Link href={feature.href}>
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
