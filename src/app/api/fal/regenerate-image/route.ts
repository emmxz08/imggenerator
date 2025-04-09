import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

// Initialize fal client with API key from environment variables
fal.config({
    credentials: process.env.FAL_KEY,
});

// Define the model ID
const MODEL_ID = "fal-ai/flux-lora";

export async function POST(request: Request) {
    if (!process.env.FAL_KEY) {
        return NextResponse.json(
            { error: "FAL_KEY environment variable not set." },
            { status: 500 }
        );
    }

    const { prompt } = await request.json();

    if (!prompt) {
        return NextResponse.json(
            { error: "Prompt is required for regeneration." },
            { status: 400 }
        );
    }

    try {
        console.log(`Regenerating 1 image for prompt: ${prompt}...`);

        // Generate 1 image
        const result: any = await fal.subscribe(MODEL_ID, {
            input: {
                prompt: prompt,
            },
        });

        // Extract image URL (Corrected path)
        let imageUrl: string | null = null;
        if (result?.data?.images && result.data.images.length > 0 && result.data.images[0]?.url) {
            imageUrl = result.data.images[0].url;
        } else {
            console.warn("Unexpected result structure during regeneration:", result);
            throw new Error("Could not extract image URL from Fal.ai response.");
        }

        if (!imageUrl) {
             console.error("Failed to generate image. Result:", result);
             throw new Error("Image URL was null after generation.");
        }

        console.log("Image regenerated successfully:", imageUrl);
        // Return the single image URL in the expected format for the frontend
        return NextResponse.json({ output: { imageUrl: imageUrl } }, { status: 200 });

    } catch (error) {
        console.error("Error calling Fal.ai API for regeneration:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Failed to regenerate image using Fal.ai" },
            { status: 500 }
        );
    }
} 