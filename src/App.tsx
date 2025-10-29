"use client";
import { motion, useInView } from "motion/react";
import type { Variants } from "motion/react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Button } from "./components/ui/button";
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
function AnimatedSection({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      id={id}
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
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/threadz.png" alt="Threadz" width={56} height={56} className="object-contain" />
            <h1 className="logo-text">Threadz.studio</h1>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-purple-500/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="hidden md:flex gap-6 items-center">
            <a 
              href="#designs" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                const section = document.getElementById('designs');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Designs
            </a>
            <a 
              href="#create" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                const section = document.getElementById('create');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Create
            </a>
            <a 
              href="/ai" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                router.push('/ai');
              }}
            >
              AI Lab
            </a>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => router.push('/products')}>Shop</Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-purple-500/20 bg-black/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-3">
              <a
                href="#designs"
                className="block px-4 py-3 rounded-lg hover:bg-purple-500/10 transition-colors nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  const section = document.getElementById('designs');
                  if (section) {
                    setTimeout(() => {
                      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }}
              >
                Designs
              </a>
              <a
                href="#create"
                className="block px-4 py-3 rounded-lg hover:bg-purple-500/10 transition-colors nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  const section = document.getElementById('create');
                  if (section) {
                    setTimeout(() => {
                      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }}
              >
                Create
              </a>
              <a
                href="/ai"
                className="block px-4 py-3 rounded-lg hover:bg-purple-500/10 transition-colors nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  router.push('/ai');
                }}
              >
                AI Lab
              </a>
              <Button 
                size="sm" 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/products');
                }}
              >
                Shop
              </Button>
            </div>
          </motion.div>
        )}
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
                onClick={() => router.push('/products')}
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
                onClick={() => router.push('/ai')}
              >
                <Pencil className="mr-2 h-5 w-5" />
                Create Your Own
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
      <AnimatedSection id="create" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-black to-gray-950">
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
                  src="/ai-fit.png"
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

      {/* Section 2 - AI Meets Streetwear */}
      <AnimatedSection id="designs" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-[#0B0B0F]" data-section="streetwear">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              🔥 Drop Alert: AI Meets Streetwear
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Funny. Bold. Too Real. New AI-coded T-shirts you'll actually want to wear.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                title: "LAID OFF",
                subtitle: "by AI",
                description: "When the algorithm becomes your boss",
                image: "/laid-off.png",
                accent: "from-red-500 to-orange-500"
              },
              {
                title: "PROMPT ENGINEER IRL",
                subtitle: "",
                description: "Making AI do the heavy lifting",
                image: "/prompt-engineer.png",
                accent: "from-blue-500 to-cyan-500"
              },
              {
                title: "TRUST ME, I ASKED CHATGPT",
                subtitle: "",
                description: "AI-approved life decisions",
                image: "/asked-chatgpt.png",
                accent: "from-green-500 to-emerald-500"
              },
              {
                title: "COFFEE-N-GPU",
                subtitle: "",
                description: "Algorithmic style, human swagger",
                image: "/coffee-n-gpu.png",
                accent: "from-purple-500 to-pink-500"
              }
            ].map((shirt, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aspect-[3/4] relative bg-gray-900">
                  <ImageWithFallback
                    src={shirt.image}
                    alt={shirt.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Dark overlay for text readability (intensifies on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Neon glow effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${shirt.accent} blur-xl`} />
                  
                  {/* Main content (reveals on hover) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <h3 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight leading-tight">
                      {shirt.title}
                    </h3>
                    {shirt.subtitle && (
                      <div className="text-lg sm:text-xl font-bold text-gray-300 mb-4 opacity-80">
                        {shirt.subtitle}
                      </div>
                    )}
                    <p className="text-sm text-gray-300 mb-6 max-w-xs leading-relaxed">
                      {shirt.description}
                    </p>
                    
                    {/* CTA Button */}
                    <button 
                      onClick={() => window.location.href = '/products'}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white font-bold rounded-full transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      👕 Cop This Design ⚡
                    </button>
                  </div>
                  
                  {/* Accent border */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r ${shirt.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => window.location.href = '/products'}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              👕 Explore Collection
            </button>
            <button 
              onClick={() => window.location.href = '/ai'}
              className="px-8 py-4 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              🎨 Generate Your Own
            </button>
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
                Affordable, sustainable, and expressive - for campus life and everyday.
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
                { icon: Instagram, href: 'https://instagram.com/threadz.wtf', label: 'Instagram' },
                { icon: Twitter, href: 'https://twitter.com/threadz_wtf', label: 'Twitter' },
                { icon: Facebook, href: 'https://facebook.com/threadz.wtf', label: 'Facebook' }
              ].map(({ icon: Icon, href, label }, idx) => (
                <motion.a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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
              <h3 className="graffiti-heading mb-2">Threadz.studio</h3>
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
          onClick={() => router.push('/ai')}
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
