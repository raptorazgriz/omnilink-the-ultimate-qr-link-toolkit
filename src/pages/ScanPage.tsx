import React, { useState } from 'react';
import { Scan, Camera, Upload, AlertCircle, RefreshCw, X, Link2, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
export function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanData, setScanData] = useState<string | null>(null);
  const startScan = () => {
    setIsScanning(true);
    toast.info("Accessing camera...");
  };
  const simulateScan = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Processing camera feed...',
        success: () => {
          setScanData("https://omnilink.io/welcome-guide");
          setShowResult(true);
          setIsScanning(false);
          return "Code detected!";
        },
        error: 'Scanning failed',
      }
    );
  };
  const resetScanner = () => {
    setIsScanning(false);
    setScanData(null);
    setShowResult(false);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-2">
              <Scan className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">QR Scanner</h1>
            <p className="text-muted-foreground">Scan physical QR codes or upload images from your gallery.</p>
          </div>
          {!isScanning ? (
            <Card className="border-2 shadow-xl">
              <CardContent className="p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button 
                    className="h-40 flex flex-col gap-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                    onClick={startScan}
                  >
                    <Camera className="h-10 w-10" />
                    <span className="text-lg font-semibold">Open Camera</span>
                  </Button>
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <Button 
                      variant="outline" 
                      className="h-40 w-full flex flex-col gap-4 border-2 border-dashed border-muted-foreground/30 rounded-3xl hover:bg-muted/50 transition-all hover:scale-[1.02]"
                    >
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <span className="text-lg font-semibold">Upload Image</span>
                    </Button>
                  </div>
                </div>
                <Alert className="mt-8 border-indigo-500/20 bg-indigo-500/5">
                  <AlertCircle className="h-4 w-4 text-indigo-500" />
                  <AlertTitle className="text-indigo-500">Permission Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser when prompted to use the live scanner.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square md:aspect-video rounded-3xl bg-black overflow-hidden shadow-2xl border-4 border-muted"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 space-y-4">
                <div className="relative h-64 w-64">
                  {/* Scanning Reticle */}
                  <div className="absolute inset-0 border-2 border-indigo-500 rounded-3xl opacity-50 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-0.5 w-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] animate-[scan-beam_2s_infinite]" />
                  </div>
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl" />
                </div>
                <p className="font-medium animate-pulse">Position QR code within frame</p>
                <Button variant="secondary" onClick={simulateScan} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-0">
                  Simulate Detect
                </Button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center px-4">
                <Button size="icon" variant="destructive" onClick={resetScanner} className="rounded-full h-12 w-12 shadow-lg">
                  <X className="h-6 w-6" />
                </Button>
                <div className="flex gap-2">
                  <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 bg-white/20 backdrop-blur-md text-white border-0">
                    <RefreshCw className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          <Dialog open={showResult} onOpenChange={setShowResult}>
            <DialogContent className="sm:max-w-md rounded-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400 flex items-center justify-center">
                    <Link2 className="h-4 w-4" />
                  </div>
                  Scan Result
                </DialogTitle>
                <DialogDescription>
                  QR code successfully decoded. Choose an action below.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-muted p-4 rounded-2xl break-all font-mono text-sm border">
                {scanData}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button variant="outline" className="rounded-xl" onClick={() => {
                  navigator.clipboard.writeText(scanData || '');
                  toast.success("Copied to clipboard");
                }}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700" asChild>
                  <a href={scanData || '#'} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Visit Link
                  </a>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <style>{`
        @keyframes scan-beam {
          0% { transform: translateY(-120px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(120px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}