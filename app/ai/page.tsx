"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ShoppingCart, AlertCircle, Wand2, Palette, Zap, ArrowLeft, X, CheckCircle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";

// Helper function to calculate price based on colors in design
// Base price: ₹899, +₹100 per additional color (max ₹1299)
function calculatePriceBasedOnColors(colors: string[]): number {
  const basePrice = 899;
  const colorCount = colors.length || 1; // Default to 1 if no colors specified
  const additionalColorPrice = Math.min(colorCount - 1, 4) * 100; // Max 4 additional colors
  return Math.min(basePrice + additionalColorPrice, 1299);
}

function AIPageContent() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<any>(null);
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
      
      // Pre-context prompt for expert graphic designer
      const expertContext = `You are a 150 IQ graphic designer with 20+ years of experience in streetwear and apparel design. You have an exceptional understanding of:
- Modern design trends and viral aesthetics
- Typography, color theory, and visual hierarchy
- What makes designs print-ready and visually striking
- Gen-Z and tech culture humor and references
- Minimalist, bold, and expressive design styles

Your designs are always:
- Print-ready and high-quality
- Trendy and relevant to current culture
- Visually balanced and aesthetically pleasing
- Suitable for t-shirt printing and apparel
- Unique and creative, never generic

`;

      // Generate design description and image prompt
      const designPrompt = `${expertContext}Create a detailed design description for a t-shirt based on this user request: "${prompt}"

      Respond with a JSON object containing:
      {
        "title": "Creative, catchy title for the design (max 5 words)",
        "description": "Engaging description that captures the design's vibe and appeal",
        "style": "Design style (minimalist, vintage, modern, geometric, abstract, urban, tech, etc.)",
        "colors": ["primary color", "secondary color"],
        "imagePrompt": "Detailed visual description of how this design would look as a t-shirt graphic"
      }

      Make it creative, trendy, and perfect for apparel printing. The design should be bold, memorable, and aligned with streetwear culture.`;

      // Try different models in order of preference
      const modelsToTry = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-pro"];
      let result;
      let lastError: any = null;
      
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          result = await model.generateContent(designPrompt);
          break; // Success, exit loop
        } catch (err: any) {
          lastError = err;
          console.log(`Failed to use ${modelName}, trying next model...`);
          continue; // Try next model
        }
      }
      
      if (!result) {
        throw lastError || new Error("All model attempts failed");
      }
      
      const response = result.response;
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
        price: calculatePriceBasedOnColors(designData.colors || []),
        image: imageUrl,
        description: designData.description,
        style: designData.style,
        colors: designData.colors,
        type: "ai-generated",
        originalPrompt: prompt
      };
      
      addItem(design);
      setGeneratedDesign(design);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Redirect to cart after 3 seconds
      setTimeout(() => {
        router.push("/cart");
      }, 3000);
      
    } catch (err: any) {
      console.error("AI generation error:", err);
      let errorMessage = "Failed to generate design. Please try again with a different prompt.";
      
      if (err?.message?.includes("404") || err?.message?.includes("not found")) {
        errorMessage = "Model not found. Please check your API key has access to Gemini models.";
      } else if (err?.message?.includes("API key") || err?.message?.includes("403")) {
        errorMessage = "Invalid API key. Please check your Gemini API key configuration.";
      } else if (err?.message) {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-40">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="bg-black/60 hover:bg-purple-500/20 border border-purple-500/30 text-white backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 text-sm font-medium mb-6 border border-purple-500/40 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Gemini AI
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              AI Design
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"> Generator</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8 opacity-90 leading-relaxed">
              Describe your vision and let AI create custom apparel designs for you. 
              From minimalist to vintage, we bring your ideas to life.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/10 to-purple-900/10" />
            
            <div className="relative p-6 sm:p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Create Your Design
                </h2>
                <p className="text-lg text-purple-200 opacity-90">
                  Enter a detailed description of the design you want to create
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-semibold text-purple-200 mb-3">
                    Design Description
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Textarea
                      id="prompt"
                      placeholder="e.g., A minimalist mountain landscape with geometric shapes in navy blue and white, perfect for a hiking t-shirt..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                      className="w-full text-lg bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400 rounded-xl transition-all duration-200"
                    />
                  </motion.div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 backdrop-blur-sm"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="rounded-full h-5 w-5 border-b-2 border-white mr-3"
                        />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5 mr-3" />
                        Generate Design
                      </>
                    )}
                  </Button>
                </motion.div>


                {prompt.trim() && !generatedImage && !isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-gray-900/50 border border-purple-500/20 rounded-xl backdrop-blur-sm"
                  >
                    <h3 className="font-semibold text-white mb-3">Preview</h3>
                    <p className="text-gray-300">
                      You're about to generate: <span className="font-semibold text-purple-300">"{prompt}"</span>
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {[
            {
              icon: Wand2,
              title: "AI-Powered",
              description: "Advanced Gemini AI technology creates unique designs",
              gradient: "from-purple-600/20 to-pink-600/20",
              iconColor: "text-purple-400",
              borderColor: "border-purple-500/30"
            },
            {
              icon: ShoppingCart,
              title: "Instant Order",
              description: "Generated designs are automatically added to your cart for purchase",
              gradient: "from-blue-600/20 to-cyan-600/20",
              iconColor: "text-blue-400",
              borderColor: "border-blue-500/30"
            },
            {
              icon: Palette,
              title: "Custom Quality",
              description: "High-quality prints on premium apparel with fast shipping",
              gradient: "from-green-600/20 to-emerald-600/20",
              iconColor: "text-green-400",
              borderColor: "border-green-500/30"
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className={`relative text-center p-8 bg-gray-900/50 backdrop-blur-sm border ${feature.borderColor} rounded-2xl hover:border-opacity-60 transition-all duration-300`}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                  <div className="relative">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 border ${feature.borderColor}`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && generatedDesign && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/cart");
              }}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-[500px] max-h-[90vh] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border border-purple-500/30 rounded-2xl shadow-2xl overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Design Generated!
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowSuccessModal(false);
                        router.push("/cart");
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center border-2 border-green-500/50"
                      >
                        <CheckCircle className="h-10 w-10 text-green-400" />
                      </motion.div>
                    </div>

                    {/* Design Preview */}
                    <div className="flex flex-col items-center gap-4 p-6 bg-gray-800/50 rounded-xl border border-purple-500/20">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="relative"
                      >
                        <Image
                          src={generatedImage}
                          alt={generatedDesign.name}
                          width={150}
                          height={150}
                          className="w-40 h-40 object-cover rounded-xl border-2 border-purple-500/50 shadow-lg"
                        />
                        <motion.div
                          className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-purple-400/50"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                          <Sparkles className="h-4 w-4 text-white" />
                        </motion.div>
                      </motion.div>
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">{generatedDesign.name}</h3>
                        <p className="text-gray-300 text-sm mb-3">{generatedDesign.description}</p>
                        <div className="flex items-center justify-center gap-2">
                          <Badge className="bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs">
                            {generatedDesign.style}
                          </Badge>
                          <span className="text-2xl font-bold text-white">
                            ₹{generatedDesign.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Success Message */}
                    <div className="p-4 bg-green-600/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-300 text-sm font-medium text-center">
                        ✓ Design generated successfully! Added to your cart.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          setShowSuccessModal(false);
                          router.push("/cart");
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white h-12 text-lg font-semibold"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        View Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowSuccessModal(false);
                          setPrompt("");
                          setGeneratedImage("");
                          setGeneratedDesign(null);
                        }}
                        className="w-full border-2 border-purple-500/50 hover:border-purple-400 hover:text-purple-300 text-white bg-black/60 backdrop-blur-sm"
                      >
                        Generate Another Design
                      </Button>
                    </div>

                    {/* Redirect Timer */}
                    <p className="text-xs text-gray-400 text-center">
                      Redirecting to cart in a moment...
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
          />
          <p className="text-purple-200">Loading AI Design Lab...</p>
        </div>
      </div>
    }>
      <AIPageContent />
    </Suspense>
  );
}
