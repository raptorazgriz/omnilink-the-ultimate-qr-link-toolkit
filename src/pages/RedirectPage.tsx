import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link2, Loader2, Compass, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { toast } from 'sonner';
export function RedirectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const trackClick = useMutation(api.links.trackClick);
  const [dots, setDots] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    const performRedirect = async () => {
      if (!slug) return;
      try {
        const destination = await trackClick({
          shortCode: slug,
          userAgent: navigator.userAgent
        });
        if (destination) {
          window.location.replace(destination);
        } else {
          setError(true);
          toast.error("Link not found or expired");
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        console.error(err);
        setError(true);
        toast.error("An error occurred during redirection");
      }
    };
    performRedirect();
    return () => clearInterval(interval);
  }, [slug, trackClick, navigate]);
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="max-w-md w-full px-6 text-center space-y-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className={`h-24 w-24 rounded-4xl flex items-center justify-center shadow-2xl transition-colors duration-500 ${error ? 'bg-destructive/10 text-destructive' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/40'}`}>
              {error ? <AlertTriangle className="h-10 w-10" /> : <Link2 className="h-10 w-10" />}
            </div>
            {!error && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute -inset-4 border-[3px] border-indigo-500/10 border-t-indigo-500 rounded-full"
              />
            )}
          </div>
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {error ? 'Link Resolution Failed' : `Opening destination${dots}`}
          </h1>
          <p className="text-muted-foreground">
            {error 
              ? "We couldn't find the requested link in our secure vault." 
              : `Verifying path /${slug} and establishing secure connection.`
            }
          </p>
        </div>
        <div className="flex justify-center gap-10 text-muted-foreground/30 py-4">
          <div className="flex flex-col items-center gap-1.5">
            <Loader2 className={`h-5 w-5 ${!error && 'animate-spin'}`} />
            <span className="text-[10px] uppercase font-black tracking-widest">Analytics</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Compass className="h-5 w-5" />
            <span className="text-[10px] uppercase font-black tracking-widest">Gateway</span>
          </div>
        </div>
        <footer className="pt-8 border-t border-muted">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            Powered by OmniLink Pro Redirection Services
          </p>
        </footer>
      </div>
    </div>
  );
}