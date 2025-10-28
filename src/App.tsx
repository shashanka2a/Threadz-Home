"use client";
import { motion, useInView } from "motion/react";
import type { Variants } from "motion/react";
import { useRef, useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Sparkles, Pencil, Shirt, Rocket, Instagram, Twitter, Facebook, Menu, X } from "lucide-react";

// Animation variants optimized for mobile
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Animated section wrapper with reduced motion support
function AnimatedSection({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="logo-text">Threadz.wtf</h1>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-purple-500/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="hidden md:flex gap-6 items-center">
            <a href="#designs" className="nav-link">Designs</a>
            <a href="#create" className="nav-link">Create</a>
            <a href="#ai-lab" className="nav-link">AI Lab</a>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Shop</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Optimized for mobile */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-16">
        {/* Gradient Background with better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/80 to-violet-900/70" />
        
        {/* Abstract pattern overlay - more sophisticated */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1758044119196-caf0016f9034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwYWJzdHJhY3QlMjBwYXR0ZXJufGVufDF8fHx8MTc2MTY0OTA4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Animated subtle grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-12 text-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="hero-headline mb-4 sm:mb-6">
              Wear What You Feel.<br />Not What They Sell.
            </h1>
            <p className="max-w-2xl mx-auto mb-8 sm:mb-12 text-purple-100 px-4 opacity-95 text-lg sm:text-xl">
              Design, customize, and cop bold streetwear made for the unapologetic Indian Gen-Z.
            </p>
          </motion.div>
          
          {/* CTA Buttons - Mobile optimized with larger touch targets */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 max-w-3xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-black hover:bg-purple-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-purple-500/30 px-6 sm:px-8 h-12 sm:h-11"
              >
                <Shirt className="mr-2 h-5 w-5" />
                Explore Designs
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-2 border-purple-300 text-purple-100 hover:bg-purple-500/10 hover:border-purple-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-purple-400/20 px-6 sm:px-8 h-12 sm:h-11"
              >
                <Pencil className="mr-2 h-5 w-5" />
                Create Your Own
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-pink-500/30 px-6 sm:px-8 h-12 sm:h-11"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Drop a Vibe
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator - hidden on mobile */}
        <motion.div
          className="hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-purple-300 rounded-full flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-purple-300 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Section 1 - Create. Customize. Cop. */}
      <AnimatedSection className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-heading mb-12 sm:mb-16 text-center">
            Create. Customize. Cop.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 items-start">
            {/* Left - Image with better visual */}
            <motion.div
              className="relative overflow-hidden rounded-2xl group order-1"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="aspect-square relative bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1666358085449-a10a39f33942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdHNoaXJ0JTIwZGVzaWduJTIwbWluaW1hbHxlbnwxfHx8fDE3NjE2NDkwODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Custom T-shirt design"
                  className="w-full h-full object-cover rounded-2xl"
                />
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition-all duration-500 rounded-2xl" />
              </div>
            </motion.div>
            
            {/* Center - Copy with better contrast */}
            <div className="flex flex-col justify-center space-y-4 sm:space-y-6 order-3 md:order-2">
              <h3 className="graffiti-heading">
                Your Style,<br />Your Rules
              </h3>
              <p className="text-gray-200 leading-relaxed">
                From bold graphics to AI designs, create apparel that speaks your language. No templates. No limits. Just pure expression.
              </p>
            </div>
            
            {/* Right - Features with improved spacing */}
            <motion.div 
              className="space-y-6 sm:space-y-8 order-2 md:order-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div 
                variants={fadeInUp} 
                className="flex items-start space-x-4 group cursor-pointer"
              >
                <div className="bg-purple-600 p-3 rounded-xl flex-shrink-0 group-hover:bg-purple-500 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/50">
                  <Pencil className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h4 className="mb-1 text-purple-100">AI Design Studio</h4>
                  <p className="text-gray-300 leading-relaxed">Type your vibe, get instant designs by AI</p>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp} 
                className="flex items-start space-x-4 group cursor-pointer"
              >
                <div className="bg-purple-600 p-3 rounded-xl flex-shrink-0 group-hover:bg-purple-500 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/50">
                  <Shirt className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h4 className="mb-1 text-purple-100">Custom Everything</h4>
                  <p className="text-gray-300 leading-relaxed">Tees, hoodies, caps - print what you imagine</p>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp} 
                className="flex items-start space-x-4 group cursor-pointer"
              >
                <div className="bg-purple-600 p-3 rounded-xl flex-shrink-0 group-hover:bg-purple-500 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/50">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h4 className="mb-1 text-purple-100">Lightning Fast Delivery</h4>
                  <p className="text-gray-300 leading-relaxed">From design to doorstep in 48 hours</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 2 - Streetwear Meets Creativity */}
      <AnimatedSection className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-heading mb-3 sm:mb-4 text-center">
            Streetwear Meets Creativity
          </h2>
          <p className="text-center text-gray-300 mb-12 sm:mb-16 max-w-2xl mx-auto px-4 leading-relaxed">
            Explore curated collections, collab with creators, or get your designs printed in 48 hours
          </p>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                title: "Culture Drops",
                description: "Limited edition designs inspired by Indian streets",
                image: "https://images.unsplash.com/photo-1624982220549-375dd6ca53f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjBtdXJhbCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MTY0OTA5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                accent: "from-purple-600 to-pink-600"
              },
              {
                title: "Collab Zone",
                description: "Team up with artists and creators",
                image: "https://images.unsplash.com/photo-1658232190602-be6cd5b976f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwaG9sb2dyYXBoaWN8ZW58MXx8fHwxNzYxNTk5NjkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                accent: "from-cyan-600 to-blue-600"
              },
              {
                title: "Fast Prints",
                description: "Upload & print custom designs instantly",
                image: "https://images.unsplash.com/photo-1666358085449-a10a39f33942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdHNoaXJ0JTIwZGVzaWduJTIwbWluaW1hbHxlbnwxfHx8fDE3NjE2NDkwODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                accent: "from-orange-600 to-red-600"
              },
              {
                title: "Vibe Archive",
                description: "Browse thousands of community designs",
                image: "https://images.unsplash.com/photo-1758044119196-caf0016f9034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwYWJzdHJhY3QlMjBwYXR0ZXJufGVufDF8fHx8MTc2MTY0OTA4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                accent: "from-violet-600 to-purple-600"
              },
              {
                title: "Sustainability First",
                description: "Eco-friendly fabrics and responsible printing",
                image: "https://images.unsplash.com/photo-1626897844971-aef92643f056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MTYzMTkwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                accent: "from-green-600 to-emerald-600"
              },
              {
                title: "Campus Fits",
                description: "Trending styles for college vibes",
                image: "https://images.unsplash.com/photo-1600440699677-c6f39725adf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHlvdXRoJTIwY3VsdHVyZXxlbnwxfHx8fDE3NjE2NDkwODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                accent: "from-pink-600 to-rose-600"
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl cursor-pointer touch-manipulation"
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aspect-[4/5] relative bg-gray-900">
                  <ImageWithFallback
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Improved gradient overlay with better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
                  
                  {/* Subtle accent glow */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br ${card.accent}`} />
                  
                  {/* Content with better readability */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    <h3 className="graffiti-heading mb-2 text-shadow">{card.title}</h3>
                    <p className="text-gray-200 leading-relaxed text-shadow-sm">{card.description}</p>
                  </div>
                  
                  {/* Accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Section 3 - AI Design Lab */}
      <AnimatedSection className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-block bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full mb-4 border border-purple-500/40">
              Beta
            </div>
            <h2 className="section-heading mb-4">
              AI Design Lab
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed">
              Describe your vibe in words, watch AI turn it into wearable art
            </p>
          </div>
          
          <motion.div 
            className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 sm:p-8 md:p-12 rounded-3xl border border-purple-500/30 backdrop-blur-sm"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="vibe-input" className="text-purple-200 mb-3 block">
                  Describe your vibe...
                </label>
                <Input
                  id="vibe-input"
                  placeholder="e.g., cosmic tiger with neon Delhi streets"
                  className="bg-black/50 border-purple-400/50 text-white placeholder:text-gray-500 h-14 sm:h-16 rounded-xl focus:border-purple-300 focus:ring-purple-300 transition-all duration-300"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 h-12 sm:h-11 active:scale-[0.98]"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Design →
                </Button>
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-purple-400/50 text-purple-200 hover:bg-purple-500/10 hover:border-purple-300 h-12 sm:h-11 active:scale-[0.98]"
                  size="lg"
                >
                  See Examples
                </Button>
              </div>
              
              {/* AI Output Preview */}
              <div className="mt-6 sm:mt-8 bg-black/40 rounded-2xl p-8 sm:p-12 border border-purple-500/20 min-h-[280px] flex items-center justify-center backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/40">
                    <Sparkles className="h-8 w-8 text-purple-300" />
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Your AI-generated design will appear here
                  </p>
                  <p className="text-purple-300">
                    Ready to bring your imagination to life?
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Section 4 - Made for the Indian Gen-Z */}
      <AnimatedSection className="py-0 relative">
        <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1600440699677-c6f39725adf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHlvdXRoJTIwY3VsdHVyZXxlbnwxfHx8fDE3NjE2NDkwODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Indian Gen-Z streetwear"
            className="w-full h-full object-cover"
          />
          
          {/* Improved overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
            <div className="text-center max-w-4xl">
              <motion.h2 
                className="hero-headline mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Born in the streets,<br />built on individuality.
              </motion.h2>
              <motion.p 
                className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                Affordable, sustainable, and expressive - for campus fits and night rides.
              </motion.p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-black py-12 sm:py-16 px-4 sm:px-6 md:px-12 border-t border-purple-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Hashtags */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {['#ThreadzWTF', '#StreetwearReinvented', '#MadeInIndia', '#WearYourMood'].map((tag) => (
                <span 
                  key={tag}
                  className="text-purple-300 hover:text-purple-200 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Closing line */}
            <p className="text-xl sm:text-2xl">
              🎧 Bold. Weird. Free.
            </p>
            
            {/* Social Icons - Mobile optimized */}
            <div className="flex justify-center gap-4 sm:gap-6">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Facebook, href: '#', label: 'Facebook' }
              ].map(({ icon: Icon, href, label }, idx) => (
                <motion.a
                  key={idx}
                  href={href}
                  aria-label={label}
                  className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-white/30 rounded-full flex items-center justify-center hover:border-purple-300 hover:bg-purple-500/20 transition-all duration-300 active:scale-95"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.a>
              ))}
            </div>
            
            {/* Brand */}
            <div className="pt-6 sm:pt-8 border-t border-purple-900/30">
              <h3 className="graffiti-heading mb-2">Threadz.wtf</h3>
              <p className="text-gray-500">
                © 2025 Threadz. All vibes reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <motion.div 
        className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-40 pointer-events-none"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 pointer-events-auto shadow-2xl shadow-purple-500/50"
          size="lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Start Creating
        </Button>
      </motion.div>

      {/* Custom Styles with mobile optimizations */}
      <style>{`
        .hero-headline {
          font-size: clamp(2rem, 7vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff 0%, #e9d5ff 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        
        .section-heading {
          font-size: clamp(1.75rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }
        
        .graffiti-heading {
          font-size: clamp(1.25rem, 3.5vw, 2rem);
          font-weight: 700;
          line-height: 1.2;
          background: linear-gradient(135deg, #c084fc, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #c084fc, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .nav-link {
          color: rgba(233, 213, 255, 0.9);
          transition: color 0.2s ease;
        }
        
        .nav-link:hover {
          color: rgba(192, 132, 252, 1);
        }
        
        .text-shadow {
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }
        
        .text-shadow-sm {
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Better focus states for accessibility */
        *:focus-visible {
          outline: 2px solid #c084fc;
          outline-offset: 2px;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* iOS safe area handling */
        @supports (padding: max(0px)) {
          .safe-bottom {
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}
