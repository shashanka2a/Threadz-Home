"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Sparkles, ShoppingCart, AlertCircle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const { addItem } = useCart();
  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError("");
    setGeneratedImage("");
    
    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAp8K90rlwgddEUzPbZQB0u8qLATmODdW4");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Generate design description and image prompt
      const designPrompt = `You are a professional apparel designer. Create a detailed design description for a t-shirt based on this user request: "${prompt}"

      Respond with a JSON object containing:
      {
        "title": "Creative title for the design",
        "description": "Detailed description of the design",
        "style": "Design style (minimalist, vintage, modern, etc.)",
        "colors": ["primary color", "secondary color"],
        "imagePrompt": "Detailed prompt for generating a visual representation of this design"
      }

      Make it creative, trendy, and suitable for apparel printing.`;

      const result = await model.generateContent(designPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const designData = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
      
      // Generate image using Gemini's image generation capabilities
      const imagePrompt = `Create a visual mockup of a t-shirt design: ${designData.imagePrompt}. 
      Show the design printed on a white t-shirt, clean and professional presentation.`;
      
      // For now, we'll use a placeholder image since Gemini doesn't directly generate images
      // In a real implementation, you'd integrate with an image generation API
      const mockImageUrl = `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&${Date.now()}`;
      
      setGeneratedImage(mockImageUrl);
      
      // Create the design object
      const design = {
        id: `design-${Date.now()}`,
        name: designData.title,
        price: 29.99,
        image: mockImageUrl,
        description: designData.description,
        style: designData.style,
        colors: designData.colors,
        type: "ai-generated",
        originalPrompt: prompt
      };
      
      addItem(design);
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        router.push("/cart");
      }, 1500);
      
    } catch (err) {
      console.error("AI generation error:", err);
      setError("Failed to generate design. Please try again with a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Design Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Describe your vision and let AI create custom apparel designs for you
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Generate Your Design
            </CardTitle>
            <CardDescription>
              Enter a detailed description of the design you want to create
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Design Description
              </label>
              <Textarea
                id="prompt"
                placeholder="e.g., A minimalist mountain landscape with geometric shapes in navy blue and white, perfect for a hiking t-shirt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Design
                  </>
                )}
              </Button>
            </div>

            {generatedImage && (
              <div className="mt-6 p-4 bg-white border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Generated Design Preview</h3>
                <div className="flex items-center gap-4">
                  <img 
                    src={generatedImage} 
                    alt="Generated design" 
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Design generated successfully! Added to your cart.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Redirecting to cart...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {prompt.trim() && !generatedImage && !isGenerating && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Preview</h3>
                <p className="text-gray-600 text-sm">
                  You're about to generate: <span className="font-medium">"{prompt}"</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">
                Advanced Gemini AI technology creates unique designs based on your description
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Order</h3>
              <p className="text-gray-600 text-sm">
                Generated designs are automatically added to your cart for purchase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Quality</h3>
              <p className="text-gray-600 text-sm">
                High-quality prints on premium apparel with fast shipping
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


