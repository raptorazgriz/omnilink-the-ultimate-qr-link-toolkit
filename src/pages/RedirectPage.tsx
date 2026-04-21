import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link2, Loader2, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
export function RedirectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    // Mock redirect logic for Phase 1
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="max-w-md w-full px-6 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <Link2 className="h-10 w-10 text-white" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute -inset-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
            />
          </div>
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Redirecting to destination{dots}
          </h1>
          <p className="text-muted-foreground">
            Verifying secure link <span className="text-indigo-500 font-mono">/{slug}</span> and preparing your destination.
          </p>
        </div>
        <div className="flex justify-center gap-8 text-muted-foreground/40 py-4">
          <div className="flex flex-col items-center gap-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-[10px] uppercase font-bold">Analytics</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Compass className="h-4 w-4" />
            <span className="text-[10px] uppercase font-bold">Secure Path</span>
          </div>
        </div>
        <footer className="pt-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/30">
            Powered by OmniLink Pro
          </p>
        </footer>
      </div>
    </div>
  );
}