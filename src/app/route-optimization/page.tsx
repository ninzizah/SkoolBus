import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Route } from 'lucide-react';
import RouteOptimizationClient from '@/components/route-optimization-client';
import Image from 'next/image';

export default function RouteOptimizationPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center justify-center md:justify-start">
          <Route className="mr-3 h-8 w-8" /> Smart Route Optimization
        </h1>
        <p className="text-muted-foreground mt-2">
          Leverage AI to get suggestions for alternative routes or schedule adjustments based on real-time traffic data.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <RouteOptimizationClient />
        </div>
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>1. Input Data:</strong> Provide the current bus route, real-time traffic observations, and the existing schedule.</p>
              <p><strong>2. AI Analysis:</strong> Our advanced AI model processes this information to identify potential delays and bottlenecks.</p>
              <p><strong>3. Get Suggestions:</strong> Receive an optimized route, schedule adjustments, and a clear explanation to minimize delays.</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="AI analyzing routes" 
                width={600} 
                height={400} 
                className="rounded-lg object-cover"
                data-ai-hint="AI data abstract" 
              />
            </CardContent>
          </Card>
           <Card className="shadow-lg bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="font-headline">Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>✓ Reduce delays and improve punctuality.</p>
              <p>✓ Enhance fuel efficiency.</p>
              <p>✓ Increase parent and student satisfaction.</p>
              <p>✓ Proactively manage traffic disruptions.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
