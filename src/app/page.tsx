"use client";

import { useState } from 'react';
import { Info, Download, RefreshCw, Loader2 } from 'lucide-react'; // Using lucide-react for icons and adding Loader2 for spinner

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>(Array(4).fill('')); // Placeholder for 4 images
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null); // Track which image is regenerating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || loading) return;
    setLoading(true);
    setImages(Array(4).fill('')); // Clear previous images

    try {
      const response = await fetch('/api/fal/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate images');
      }

      const data = await response.json();
      // The Replicate API returns an array of URLs in the output field
      if (data.output && Array.isArray(data.output) && data.output.length === 4) {
        setImages(data.output);
      } else {
        console.error("Unexpected API response format:", data);
        throw new Error('Received unexpected data from the server.');
      }

    } catch (error) {
      console.error("Error generating images:", error);
      // TODO: Display error to the user (e.g., using a toast notification)
      alert(`Error: ${(error as Error).message}`); // Simple alert for now
      setImages(Array(4).fill('')); // Clear placeholders on error
    } finally {
      setLoading(false);
    }
  };

  // --- Download Handler ---
  const handleDownload = async (imgSrc: string, index: number) => {
    if (!imgSrc) return;
    try {
        // Fetch the image data as a blob
        const response = await fetch(imgSrc);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        // Suggest a filename - try to get type or default to png
        const extension = blob.type.split('/')[1] || 'png';
        link.download = `fal-image-${index + 1}.${extension}`;

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the temporary URL
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error downloading image:", error);
        alert(`Failed to download image: ${(error as Error).message}`);
    }
  };

  // --- Regenerate Handler ---
  const handleRegenerate = async (index: number) => {
    if (loading || regeneratingIndex !== null || !prompt) return; // Prevent overlapping requests

    setRegeneratingIndex(index); // Set loading state for this specific image
    const originalUrl = images[index]; // Keep original URL in case of failure
    setImages(prev => prev.map((img, i) => (i === index ? '' : img))); // Show placeholder/spinner

    try {
      const response = await fetch('/api/fal/regenerate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }), // Use the original prompt
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to regenerate image');
      }

      const data = await response.json();

      if (data.output?.imageUrl) {
        // Update only the regenerated image
        setImages(prev => prev.map((img, i) => (i === index ? data.output.imageUrl : img)));
      } else {
        throw new Error('Invalid response format from regeneration API');
      }

    } catch (error) {
      console.error(`Error regenerating image ${index}:`, error);
      alert(`Failed to regenerate image ${index + 1}: ${(error as Error).message}`);
      // Restore original image on error
      setImages(prev => prev.map((img, i) => (i === index ? originalUrl : img)));
    } finally {
      setRegeneratingIndex(null); // Clear loading state for this image
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-4xl">
        {/* Info Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300 shadow-md"
            aria-label="Information"
          >
            <Info className="h-6 w-6 text-indigo-600" />
          </button>
        </div>

        {/* Info Modal/Popup */}
        {showInfo && (
          <div className="absolute top-16 right-4 w-64 bg-white p-4 rounded-lg shadow-xl z-10 border border-gray-200">
            <h4 className="font-semibold text-lg mb-2 text-indigo-700">How it works:</h4>
            <p className="text-sm text-gray-600">
              Enter a text description (prompt) of the image you want to create. The AI model will
              generate four unique images based on your prompt using the Fal.ai API with the
              FLUX.1 model.
            </p>
            <button
                onClick={() => setShowInfo(false)}
                className="mt-3 text-xs text-indigo-500 hover:underline"
            >
                Close
            </button>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
          Generate Images with AI ✨
        </h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your image prompt..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-300 shadow-sm text-black"
            disabled={loading}
          />
          <button
            type="submit"
            className={`p-3 px-6 rounded-lg text-white font-semibold transition duration-300 ease-in-out shadow-md ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transform'
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Generate'
            )}
          </button>
        </form>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {images.map((imgSrc, index) => {
            const isRegenerating = regeneratingIndex === index;
            return (
              <div
                key={index}
                className={`relative aspect-square rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shadow-lg transition-all duration-500 ease-in-out ${ // Removed hover:scale-105 when regenerating
                  (loading || isRegenerating) ? 'animate-pulse' : 'transform hover:scale-105' // Pulse if loading globally OR regenerating individually
                }`}
              >
                {imgSrc && !isRegenerating ? ( // Show image only if src exists AND not regenerating
                  <>
                    <img
                      src={imgSrc}
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Icon Buttons Overlay */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleDownload(imgSrc, index)}
                        className="p-1.5 rounded bg-black/40 text-white hover:bg-black/60 transition-colors duration-200 disabled:opacity-50"
                        aria-label="Download image"
                        disabled={regeneratingIndex !== null || loading} // Disable buttons during any loading
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRegenerate(index)}
                        className="p-1.5 rounded bg-black/40 text-white hover:bg-black/60 transition-colors duration-200 disabled:opacity-50"
                        aria-label="Regenerate image"
                        disabled={regeneratingIndex !== null || loading} // Disable buttons during any loading
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  // Show placeholder or spinner
                  <div className="text-gray-400 text-center p-4 flex flex-col items-center justify-center">
                    {(loading || isRegenerating) ? (
                       <Loader2 className="h-12 w-12 mx-auto mb-2 opacity-50 animate-spin" />
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                     )
                    }
                    Image {index + 1} {isRegenerating ? 'regenerating...' : loading ? 'generating...' : 'will appear here'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
