// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview An AI agent that suggests optimized routes or schedule adjustments based on real-time traffic data to minimize bus delays.
 *
 * - smartRouteOptimization - A function that handles the route optimization process.
 * - SmartRouteOptimizationInput - The input type for the smartRouteOptimization function.
 * - SmartRouteOptimizationOutput - The return type for the smartRouteOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartRouteOptimizationInputSchema = z.object({
  currentRoute: z.string().describe('The current route of the bus.'),
  trafficData: z.string().describe('Real-time traffic data for the route.'),
  currentSchedule: z.string().describe('The current schedule of the bus route.'),
});
export type SmartRouteOptimizationInput = z.infer<
  typeof SmartRouteOptimizationInputSchema
>;

const SmartRouteOptimizationOutputSchema = z.object({
  optimizedRoute: z
    .string()
    .describe('The optimized route suggested by the AI.'),
  scheduleAdjustments:
    z.string().describe('Suggested adjustments to the bus schedule.'),
  delayExplanation: z
    .string()
    .describe('Explanation of potential delays and how the new route avoids them.'),
});
export type SmartRouteOptimizationOutput = z.infer<
  typeof SmartRouteOptimizationOutputSchema
>;

export async function smartRouteOptimization(
  input: SmartRouteOptimizationInput
): Promise<SmartRouteOptimizationOutput> {
  return smartRouteOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartRouteOptimizationPrompt',
  input: {schema: SmartRouteOptimizationInputSchema},
  output: {schema: SmartRouteOptimizationOutputSchema},
  prompt: `You are an AI assistant specialized in optimizing bus routes based on real-time traffic data.

  Given the current route: {{{currentRoute}}},
  the real-time traffic data: {{{trafficData}}},
  and the current schedule: {{{currentSchedule}}},

  suggest an optimized route and any necessary schedule adjustments to minimize delays.
  Explain potential delays and how the new route avoids them.
  Return the response in a structured format.

  Optimized Route: 
  Schedule Adjustments: 
  Delay Explanation:`,
});

const smartRouteOptimizationFlow = ai.defineFlow(
  {
    name: 'smartRouteOptimizationFlow',
    inputSchema: SmartRouteOptimizationInputSchema,
    outputSchema: SmartRouteOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
