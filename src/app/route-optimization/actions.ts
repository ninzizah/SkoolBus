"use server";

import { smartRouteOptimization } from "@/ai/flows/smart-route-optimization";
import type { SmartRouteOptimizationInput, SmartRouteOptimizationOutput } from "@/ai/flows/smart-route-optimization";
import type { RouteOptimizationFormData } from "@/types";
import { routeOptimizationSchema } from "@/types";

interface ActionResult {
  success: boolean;
  data?: SmartRouteOptimizationOutput;
  error?: string;
  fieldErrors?: Partial<Record<keyof RouteOptimizationFormData, string[]>>;
}

export async function getOptimizedRoute(
  formData: RouteOptimizationFormData
): Promise<ActionResult> {
  const validationResult = routeOptimizationSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Invalid input data.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const input: SmartRouteOptimizationInput = {
    currentRoute: validationResult.data.currentRoute,
    trafficData: validationResult.data.trafficData,
    currentSchedule: validationResult.data.currentSchedule,
  };

  try {
    const output = await smartRouteOptimization(input);
    return { success: true, data: output };
  } catch (e) {
    console.error("Error in smartRouteOptimization flow:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during route optimization.";
    return { success: false, error: `AI processing failed: ${errorMessage}` };
  }
}
