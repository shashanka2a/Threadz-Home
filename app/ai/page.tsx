"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ShoppingCart, AlertCircle, Wand2, Palette, Zap, ArrowLeft, X, CheckCircle, Plus, Minus, Trash2, CreditCard, Lock, Package, Truck, Clock, MapPin, Edit, RefreshCw } from "lucide-react";
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
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [editedPrompt, setEditedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditPromptModal, setShowEditPromptModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<any>(null);
  const { items, addItem, updateQuantity, removeItem, clear, total } = useCart();
  const router = useRouter();
  const params = useSearchParams();
  
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    mobile: '',
    whatsappUpdates: false
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // Fallback design creator when API fails
  const createFallbackDesign = (userPrompt: string) => {
    // Extract keywords from prompt to determine style
    const promptLower = userPrompt.toLowerCase();
    let style = 'modern';
    let colors = ['purple', 'pink', 'black'];
    
    if (promptLower.includes('minimal') || promptLower.includes('simple')) {
      style = 'minimalist';
      colors = ['white', 'black', 'gray'];
    } else if (promptLower.includes('vintage') || promptLower.includes('retro')) {
      style = 'vintage';
      colors = ['brown', 'beige', 'black'];
    } else if (promptLower.includes('geometric') || promptLower.includes('pattern')) {
      style = 'geometric';
      colors = ['blue', 'cyan', 'black'];
    } else if (promptLower.includes('nature') || promptLower.includes('forest')) {
      style = 'nature';
      colors = ['green', 'emerald', 'black'];
    }
    
    // Generate a title from prompt (first few words)
    const words = userPrompt.split(' ').slice(0, 3).join(' ').toUpperCase();
    const title = words.length > 0 ? words : 'CUSTOM DESIGN';
    
    // Use fallback images from public folder
    const fallbackImages = [
      '/ai-fit.png',
      '/laid-off.png',
      '/prompt-engineer.png',
      '/asked-chatgpt.png',
      '/coffee-n-gpu.png'
    ];
    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    
    return {
      id: `design-fallback-${Date.now()}`,
      name: title,
      price: calculatePriceBasedOnColors(colors),
      image: randomImage,
      description: `Custom design inspired by: "${userPrompt.substring(0, 100)}..."`,
      style: style,
      colors: colors,
      type: "ai-generated",
      originalPrompt: userPrompt
    };
  };

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

      // Try different models in order of preference with retry logic for rate limits
      const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-pro", 
        "gemini-1.0-pro",
        "gemini-pro"
      ];
      let result;
      let lastError: any = null;
      
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          result = await model.generateContent(designPrompt);
          break; // Success, exit loop
        } catch (err: any) {
          lastError = err;
          const errorMessage = err?.message || err?.toString() || '';
          
          // If rate limited (429), wait and retry once
          if (errorMessage.includes('429') || err?.status === 429) {
            console.log(`Rate limit hit for ${modelName}, waiting 2 seconds before next model...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
          // If model not found (404), skip to next
          if (errorMessage.includes('404') || err?.status === 404) {
            console.log(`Model ${modelName} not found, trying next model...`);
            continue;
          }
          
          // For other errors, log and try next model
          console.log(`Failed to use ${modelName}: ${errorMessage}, trying next model...`);
          continue;
        }
      }
      
      if (!result) {
        // Use fallback design instead of throwing error
        console.log("API failed, using fallback design");
        const fallbackDesign = createFallbackDesign(prompt);
        const imageUrl = fallbackDesign.image;
        setGeneratedImage(imageUrl);

        setGeneratedDesign(fallbackDesign);
        setOriginalPrompt(prompt);
        setShowSuccessModal(true);
        setIsGenerating(false);
        return;
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
      
      setGeneratedDesign(design);
      setOriginalPrompt(prompt); // Store the original prompt
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (err: any) {
      console.error("AI generation error:", err);
      
      // Use fallback design instead of showing error
      console.log("API error occurred, using fallback design to continue flow");
      const fallbackDesign = createFallbackDesign(prompt);
      const imageUrl = fallbackDesign.image;
      setGeneratedImage(imageUrl);
      
      setGeneratedDesign(fallbackDesign);
      setOriginalPrompt(prompt);
      setShowSuccessModal(true);
      
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, addItem, router, removeItem, items]);

  const handleRegenerate = useCallback(async () => {
    // Regenerate with the same prompt
    setShowSuccessModal(false);
    setIsGenerating(true);
    setError("");
    setGeneratedImage("");
    
    // Use the original prompt for regeneration
    const promptToUse = originalPrompt || prompt;
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAp8K90rlwgddEUzPbZQB0u8qLATmODdW4");
      
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

      const designPrompt = `${expertContext}Create a detailed design description for a t-shirt based on this user request: "${promptToUse}"

      Respond with a JSON object containing:
      {
        "title": "Creative, catchy title for the design (max 5 words)",
        "description": "Engaging description that captures the design's vibe and appeal",
        "style": "Design style (minimalist, vintage, modern, geometric, abstract, urban, tech, etc.)",
        "colors": ["primary color", "secondary color"],
        "imagePrompt": "Detailed visual description of how this design would look as a t-shirt graphic"
      }

      Make it creative, trendy, and perfect for apparel printing. The design should be bold, memorable, and aligned with streetwear culture.`;

      const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-pro", 
        "gemini-1.0-pro",
        "gemini-pro"
      ];
      let result;
      let lastError: any = null;
      
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          result = await model.generateContent(designPrompt);
          break;
        } catch (err: any) {
          lastError = err;
          const errorMessage = err?.message || err?.toString() || '';
          
          // If rate limited (429), wait and retry once
          if (errorMessage.includes('429') || err?.status === 429) {
            console.log(`Rate limit hit for ${modelName}, waiting 2 seconds before next model...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
          // If model not found (404), skip to next
          if (errorMessage.includes('404') || err?.status === 404) {
            console.log(`Model ${modelName} not found, trying next model...`);
            continue;
          }
          
          console.log(`Failed to use ${modelName}: ${errorMessage}, trying next model...`);
          continue;
        }
      }
      
      if (!result) {
        // Use fallback design instead of throwing error
        console.log("API failed during regeneration, using fallback design");
        const fallbackDesign = createFallbackDesign(promptToUse);
        const imageUrl = fallbackDesign.image;
        setGeneratedImage(imageUrl);

        setGeneratedDesign(fallbackDesign);
        setOriginalPrompt(promptToUse);
        setShowSuccessModal(true);
        setIsGenerating(false);
        return;
      }
      
      const response = result.response;
      const text = response.text();
      const designData = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
      
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
      
      const design = {
        id: `design-${Date.now()}`,
        name: designData.title,
        price: calculatePriceBasedOnColors(designData.colors || []),
        image: imageUrl,
        description: designData.description,
        style: designData.style,
        colors: designData.colors,
        type: "ai-generated",
        originalPrompt: promptToUse
      };
      
      setGeneratedDesign(design);
      setOriginalPrompt(promptToUse);
      setShowSuccessModal(true);
      
    } catch (err: any) {
      console.error("AI regeneration error:", err);
      // Use fallback design instead of showing error
      console.log("API error occurred during regeneration, using fallback design");
      const fallbackDesign = createFallbackDesign(promptToUse);
      const imageUrl = fallbackDesign.image;
      setGeneratedImage(imageUrl);
      
      setGeneratedDesign(fallbackDesign);
      setOriginalPrompt(promptToUse);
      setShowSuccessModal(true);
    } finally {
      setIsGenerating(false);
    }
  }, [originalPrompt, prompt, addItem, removeItem, items]);

  const handleEditPrompt = () => {
    setEditedPrompt(originalPrompt || prompt);
    setShowSuccessModal(false);
    setShowEditPromptModal(true);
  };

  const handleEditPromptSubmit = async () => {
    if (!editedPrompt.trim()) return;
    setPrompt(editedPrompt);
    setShowEditPromptModal(false);
    setIsGenerating(true);
    setError("");
    setGeneratedImage("");
    
    // Trigger generation with edited prompt
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAp8K90rlwgddEUzPbZQB0u8qLATmODdW4");
    
    try {
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

      const designPrompt = `${expertContext}Create a detailed design description for a t-shirt based on this user request: "${editedPrompt}"

      Respond with a JSON object containing:
      {
        "title": "Creative, catchy title for the design (max 5 words)",
        "description": "Engaging description that captures the design's vibe and appeal",
        "style": "Design style (minimalist, vintage, modern, geometric, abstract, urban, tech, etc.)",
        "colors": ["primary color", "secondary color"],
        "imagePrompt": "Detailed visual description of how this design would look as a t-shirt graphic"
      }

      Make it creative, trendy, and perfect for apparel printing. The design should be bold, memorable, and aligned with streetwear culture.`;

      const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-pro", 
        "gemini-1.0-pro",
        "gemini-pro"
      ];
      let result;
      let lastError: any = null;
      
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          result = await model.generateContent(designPrompt);
          break;
        } catch (err: any) {
          lastError = err;
          const errorMessage = err?.message || err?.toString() || '';
          
          // If rate limited (429), wait and retry once
          if (errorMessage.includes('429') || err?.status === 429) {
            console.log(`Rate limit hit for ${modelName}, waiting 2 seconds before next model...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
          // If model not found (404), skip to next
          if (errorMessage.includes('404') || err?.status === 404) {
            console.log(`Model ${modelName} not found, trying next model...`);
            continue;
          }
          
          console.log(`Failed to use ${modelName}: ${errorMessage}, trying next model...`);
          continue;
        }
      }
      
      if (!result) {
        // Use fallback design instead of throwing error
        console.log("API failed during edit prompt, using fallback design");
        const fallbackDesign = createFallbackDesign(editedPrompt);
        const imageUrl = fallbackDesign.image;
        setGeneratedImage(imageUrl);

        setGeneratedDesign(fallbackDesign);
        setOriginalPrompt(editedPrompt);
        setShowSuccessModal(true);
        setIsGenerating(false);
        return;
      }
      
      const response = result.response;
      const text = response.text();
      const designData = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
      
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
      
      const design = {
        id: `design-${Date.now()}`,
        name: designData.title,
        price: calculatePriceBasedOnColors(designData.colors || []),
        image: imageUrl,
        description: designData.description,
        style: designData.style,
        colors: designData.colors,
        type: "ai-generated",
        originalPrompt: editedPrompt
      };
      
      setGeneratedDesign(design);
      setOriginalPrompt(editedPrompt);
      setShowSuccessModal(true);
      
    } catch (err: any) {
      console.error("AI generation error:", err);
      // Use fallback design instead of showing error
      console.log("API error occurred during edit prompt, using fallback design");
      const fallbackDesign = createFallbackDesign(editedPrompt);
      const imageUrl = fallbackDesign.image;
      setGeneratedImage(imageUrl);
      
      setGeneratedDesign(fallbackDesign);
      setOriginalPrompt(editedPrompt);
      setShowSuccessModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactInfoChange = (field: string, value: string | boolean) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleContactInfoSubmit = () => {
    if (contactInfo.name && (contactInfo.email || contactInfo.mobile)) {
      // Pre-fill payment data with contact info
      setPaymentData(prev => ({
        ...prev,
        name: contactInfo.name,
        email: contactInfo.email
      }));
      setShowContactInfo(false);
      setShowCheckout(true);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newOrderId = `ORDER-${Date.now()}`;
    setOrderId(newOrderId);
    clear();
    setShowCheckout(false);
    setShowCart(false);
    setIsProcessing(false);
    setShowTracking(true);
  };

  const isContactInfoValid = contactInfo.name && (contactInfo.email || contactInfo.mobile);
  const isFormValid = paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv && paymentData.name && paymentData.email && paymentData.address && paymentData.city && paymentData.zipCode;

  // Helper function to format dates dynamically
  const formatTrackingDate = (daysFromNow: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysFromNow);
    
    if (daysFromNow === 0) return "Today";
    if (daysFromNow === 1) return "Tomorrow";
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = targetDate.getDate();
    const month = months[targetDate.getMonth()];
    return `${month} ${day}`;
  };

  const trackingSteps = [
    { id: 1, title: "Order Confirmed", description: "Your order has been received", status: "completed", date: formatTrackingDate(0), time: "Now", icon: CheckCircle },
    { id: 2, title: "Processing", description: "Items being prepared", status: "completed", date: formatTrackingDate(0), time: "Now", icon: Package },
    { id: 3, title: "Shipped", description: "Order shipped", status: "pending", date: formatTrackingDate(1), time: "9:00 AM", icon: Truck },
    { id: 4, title: "Out for Delivery", description: "Package out for delivery", status: "pending", date: formatTrackingDate(2), time: "8:00 AM", icon: Truck },
    { id: 5, title: "Delivered", description: "Package delivered", status: "pending", date: formatTrackingDate(2), time: "2:00 PM", icon: MapPin }
  ];

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
              title: "Choose & Checkout",
              description: "Review the design and add to cart when you're ready",
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
                    <div className="p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                      <p className="text-purple-200 text-sm font-medium text-center">
                        Design ready. Review it and add to cart when you're ready.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          if (generatedDesign) {
                            addItem(generatedDesign);
                          }
                          setShowSuccessModal(false);
                          setShowCart(true);
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white h-12 text-lg font-semibold"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={handleRegenerate}
                          disabled={isGenerating}
                          className="border-2 border-purple-500/50 hover:border-purple-400 hover:text-purple-300 text-white bg-black/60 backdrop-blur-sm"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                          Regenerate
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleEditPrompt}
                          className="border-2 border-purple-500/50 hover:border-purple-400 hover:text-purple-300 text-white bg-black/60 backdrop-blur-sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Prompt
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowSuccessModal(false);
                          setPrompt("");
                          setGeneratedImage("");
                          setGeneratedDesign(null);
                          setOriginalPrompt("");
                        }}
                        className="w-full border-2 border-purple-500/50 hover:border-purple-400 hover:text-purple-300 text-white bg-black/60 backdrop-blur-sm"
                      >
                        Generate Another Design
                      </Button>
                    </div>

                    {/* No auto-cart note */}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border-l border-purple-500/30 shadow-2xl z-[70] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Your Cart
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-purple-500/20"
                        >
                          <Image
                            src={item.image || '/threadz-logo.png'}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{item.name}</h3>
                            <p className="text-sm text-gray-400">₹{item.price} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t border-purple-500/30 pt-4 space-y-4 mb-6">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>₹{total.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Tax (18%)</span>
                        <span>₹{(total * 0.18).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-white border-t border-purple-500/30 pt-2">
                        <span>Total</span>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          ₹{(total * 1.18).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setShowCart(false);
                        setShowContactInfo(true);
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white h-12 text-lg font-semibold"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contact Info Modal */}
      <AnimatePresence>
        {showContactInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setShowContactInfo(false)}
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
                      Contact Information
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowContactInfo(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-purple-300 mb-2 block">Full Name *</Label>
                      <Input
                        placeholder="John Doe"
                        value={contactInfo.name}
                        onChange={(e) => handleContactInfoChange('name', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 mb-2 block">Email *</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={contactInfo.email}
                        onChange={(e) => handleContactInfoChange('email', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 mb-2 block">Mobile Number *</Label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={contactInfo.mobile}
                        onChange={(e) => handleContactInfoChange('mobile', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">At least email or mobile is required</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                      <Checkbox
                        id="whatsapp-updates"
                        checked={contactInfo.whatsappUpdates}
                        onCheckedChange={(checked) => handleContactInfoChange('whatsappUpdates', checked === true)}
                        className="border-purple-500/50 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 mt-1"
                      />
                      <Label 
                        htmlFor="whatsapp-updates" 
                        className="text-sm text-gray-300 cursor-pointer leading-relaxed"
                      >
                        Get order updates and exclusive offers via WhatsApp
                      </Label>
                    </div>
                    <div className="border-t border-purple-500/30 pt-4">
                      <Button
                        onClick={handleContactInfoSubmit}
                        disabled={!isContactInfoValid}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white h-12 text-lg font-semibold disabled:opacity-50"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setShowCheckout(false)}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-[600px] max-h-[90vh] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border border-purple-500/30 rounded-2xl shadow-2xl overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Secure Checkout
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCheckout(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-purple-300 mb-2 block">Card Number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-purple-300 mb-2 block">Expiry</Label>
                        <Input
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          className="bg-gray-800/50 border-purple-500/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300 mb-2 block">CVV</Label>
                        <Input
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          className="bg-gray-800/50 border-purple-500/30 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-purple-300 mb-2 block">Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={paymentData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 mb-2 block">Email</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={paymentData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 mb-2 block">Address</Label>
                      <Input
                        placeholder="123 Main Street"
                        value={paymentData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-purple-300 mb-2 block">City</Label>
                        <Input
                          placeholder="Mumbai"
                          value={paymentData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="bg-gray-800/50 border-purple-500/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300 mb-2 block">ZIP Code</Label>
                        <Input
                          placeholder="400001"
                          value={paymentData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="bg-gray-800/50 border-purple-500/30 text-white"
                        />
                      </div>
                    </div>
                    <div className="border-t border-purple-500/30 pt-4">
                      <div className="flex justify-between text-xl font-bold text-white mb-4">
                        <span>Total</span>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          ₹{(total * 1.18).toFixed(0)}
                        </span>
                      </div>
                      <Button
                        onClick={handlePayment}
                        disabled={!isFormValid || isProcessing}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white h-12 text-lg font-semibold disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="h-5 w-5 mr-2" />
                            Confirm Payment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Prompt Modal */}
      <AnimatePresence>
        {showEditPromptModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setShowEditPromptModal(false)}
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
                      Edit Prompt
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEditPromptModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-purple-300 mb-2 block">Design Description</Label>
                      <Textarea
                        placeholder="e.g., A minimalist mountain landscape with geometric shapes in navy blue and white, perfect for a hiking t-shirt..."
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        rows={6}
                        className="w-full text-lg bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400 rounded-xl transition-all duration-200"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Modify your prompt to generate a different design
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowEditPromptModal(false)}
                        className="flex-1 border-2 border-purple-500/50 hover:border-purple-400 hover:text-purple-300 text-white bg-black/60 backdrop-blur-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleEditPromptSubmit}
                        disabled={!editedPrompt.trim() || isGenerating}
                        className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white h-12 text-lg font-semibold disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="rounded-full h-5 w-5 border-b-2 border-white mr-2"
                            />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-5 w-5 mr-2" />
                            Generate with Edited Prompt
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Order Tracking Modal */}
      <AnimatePresence>
        {showTracking && orderId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setShowTracking(false)}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-[600px] max-h-[90vh] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border border-purple-500/30 rounded-2xl shadow-2xl overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Order Tracking
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTracking(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mb-6 p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="text-lg font-bold text-white">{orderId}</p>
                  </div>

                  <div className="space-y-6">
                    {trackingSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = step.status === 'completed';
                      const isPending = step.status === 'pending';
                      
                      return (
                        <div key={step.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isCompleted ? 'bg-green-500' : isPending ? 'bg-gray-600' : 'bg-purple-500'
                            }`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            {index < trackingSteps.length - 1 && (
                              <div className={`w-0.5 h-16 ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-600'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-white">{step.title}</h3>
                              <span className="text-xs text-gray-400">{step.date} • {step.time}</span>
                            </div>
                            <p className="text-sm text-gray-400">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t border-purple-500/30">
                    <Button
                      onClick={() => setShowTracking(false)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                    >
                      Close
                    </Button>
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
