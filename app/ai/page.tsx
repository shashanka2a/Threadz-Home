"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ShoppingCart, AlertCircle, Wand2, Palette, Zap } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";

function AIPageContent() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const { addItem } = useCart();
  const router = useRouter();
  const params = useSearchParams();

      const handleGenerate = useCallback(async () => {
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
      
      // Use appropriate Unsplash images based on design style
      const getImageUrl = (style: string) => {
        const styleImages: Record<string, string> = {
          'minimalist': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80&auto=format',
          'vintage': 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&q=80&auto=format',
          'modern': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80&auto=format',
          'geometric': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80&auto=format',
          'nature': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80&auto=format',
          'abstract': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80&auto=format'
        };
        return styleImages[style.toLowerCase()] || styleImages['modern'];
      };
      
      const imageUrl = getImageUrl(designData.style);
      setGeneratedImage(imageUrl);
      
      // Create the design object
      const design = {
        id: `design-${Date.now()}`,
        name: designData.title,
        price: 29.99,
        image: imageUrl,
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
      }, 2000);
      
    } catch (err) {
      console.error("AI generation error:", err);
      setError("Failed to generate design. Please try again with a different prompt.");
        } finally {
      setIsGenerating(false);
    }
      }, [prompt, addItem, router]);

      useEffect(() => {
        const p = params.get('prompt');
        if (p && !generatedImage && !isGenerating) {
          setPrompt(p);
          // Defer to allow state update before generating
          setTimeout(() => {
            void handleGenerate();
          }, 0);
        }
      }, [params, handleGenerate, generatedImage, isGenerating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Gemini AI
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              AI Design
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Generator</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Describe your vision and let AI create custom apparel designs for you. 
              From minimalist to vintage, we bring your ideas to life.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Create Your Design
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Enter a detailed description of the design you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700 mb-3">
                  Design Description
                </label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., A minimalist mountain landscape with geometric shapes in navy blue and white, perfect for a hiking t-shirt..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-3" />
                    Generate Design
                  </>
                )}
              </Button>

              {generatedImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl"
                >
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">Generated Design Preview</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Image 
                        src={generatedImage} 
                        alt="Generated design" 
                        width={120}
                        height={120}
                        className="w-30 h-30 object-cover rounded-xl border-2 border-white shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 font-medium mb-2">
                        Design generated successfully! Added to your cart.
                      </p>
                      <p className="text-sm text-gray-500">
                        Redirecting to cart in a moment...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {prompt.trim() && !generatedImage && !isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-3">Preview</h3>
                  <p className="text-gray-600">
                    You're about to generate: <span className="font-semibold text-purple-600">"{prompt}"</span>
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wand2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced Gemini AI technology creates unique designs based on your description
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Order</h3>
              <p className="text-gray-600 leading-relaxed">
                Generated designs are automatically added to your cart for purchase
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Palette className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                High-quality prints on premium apparel with fast shipping
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Design Lab...</p>
        </div>
      </div>
    }>
      <AIPageContent />
    </Suspense>
  );
}


