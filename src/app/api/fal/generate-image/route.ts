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
            { error: "Prompt is required." },
            { status: 400 }
        );
    }

    try {
        console.log(`Generating 4 images for prompt: ${prompt}...`);

        // Generate 4 images by calling the model 4 times in parallel
        const generationPromises = Array(4).fill(null).map(() =>
            fal.subscribe(MODEL_ID, {
                input: {
                    prompt: prompt,
                },
            })
        );

        const results = await Promise.all(generationPromises);

        // Extract image URLs from results (Corrected path)
        const imageURLs = results.map((result: any) => {
             // Access result.data.images instead of result.images
             if (result?.data?.images && result.data.images.length > 0 && result.data.images[0]?.url) {
                 return result.data.images[0].url;
             } else {
                 console.warn("Unexpected result structure for one image from Fal.ai:", result);
                 return null; // Handle cases where an image URL might be missing
             }
         }).filter((url: string | null) => url !== null);

        if (imageURLs.length !== 4) {
             // Keep detailed logging just in case
             console.error("Failed to generate all 4 images. Final extracted URLs:", imageURLs);
             console.error("Original results array was:", results);
             throw new Error(`Could not generate 4 images. Only got ${imageURLs.length}.`);
        }

        console.log("Images generated successfully:", imageURLs);
        return NextResponse.json({ output: imageURLs }, { status: 200 });

    } catch (error) {
        console.error("Error calling Fal.ai API:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Failed to generate images using Fal.ai" },
            { status: 500 }
        );
    }
} 