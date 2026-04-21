import React, { useState } from 'react';
import { Scan, Camera, Upload, AlertCircle, RefreshCw, X, Link2, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Scanner } from '@yudiel/react-qr-scanner';
export function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanData, setScanData] = useState<string | null>(null);
  const handleScan = (result: any) => {
    if (result?.[0]?.rawValue) {
      const data = result[0].rawValue;
      setScanData(data);
      setShowResult(true);
      setIsScanning(false);
      toast.success("Code detected!");
    }
  };
  const handleError = (error: any) => {
    console.error(error);
    toast.error("Camera access failed or scanner error.");
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
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-2 shadow-inner">
              <Scan className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">QR Scanner</h1>
            <p className="text-muted-foreground">Scan physical QR codes using your device camera.</p>
          </div>
          {!isScanning ? (
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    className="h-44 flex flex-col gap-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                    onClick={() => setIsScanning(true)}
                  >
                    <Camera className="h-12 w-12" />
                    <span className="text-lg font-bold">Start Live Scan</span>
                  </Button>
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <Button
                      variant="outline"
                      className="h-44 w-full flex flex-col gap-4 border-2 border-dashed border-muted-foreground/30 rounded-3xl hover:bg-muted/50 transition-all hover:scale-[1.02]"
                    >
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <span className="text-lg font-bold">Upload Gallery</span>
                    </Button>
                  </div>
                </div>
                <Alert className="mt-8 border-indigo-500/20 bg-indigo-500/5">
                  <AlertCircle className="h-4 w-4 text-indigo-500" />
                  <AlertTitle className="text-indigo-500">Security Check</AlertTitle>
                  <AlertDescription>
                    We only process standard QR formats. Scanning happens locally in your browser.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square md:aspect-video rounded-3xl bg-black overflow-hidden shadow-2xl border-4 border-muted"
            >
              <div className="absolute inset-0 z-0">
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  allowMultiple={false}
                  constraints={{ facingMode: 'environment' }}
                />
              </div>
              {/* HUD Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="relative h-64 w-64 md:h-80 md:w-80">
                  <div className="absolute inset-0 border-2 border-indigo-500/50 rounded-3xl animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
                  <div className="absolute inset-x-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] animate-[scan-beam_2s_infinite]" />
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-indigo-500 rounded-br-xl" />
                </div>
              </div>
              <div className="absolute top-6 left-6 z-20">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Live Link Feed</span>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-center px-4">
                <Button size="lg" variant="destructive" onClick={resetScanner} className="rounded-full shadow-lg h-14 w-14 p-0">
                  <X className="h-7 w-7" />
                </Button>
                <div className="flex gap-2">
                  <Button size="lg" variant="secondary" className="rounded-full h-14 w-14 bg-white/20 backdrop-blur-md text-white border-0 p-0">
                    <RefreshCw className="h-7 w-7" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          <Dialog open={showResult} onOpenChange={setShowResult}>
            <DialogContent className="sm:max-w-md rounded-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400 flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  Decoded Content
                </DialogTitle>
                <DialogDescription>
                  Safe link detected. You can copy the content or visit it directly.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-muted p-5 rounded-2xl break-all font-mono text-sm border shadow-inner">
                {scanData}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button variant="outline" className="rounded-xl h-12" onClick={() => {
                  navigator.clipboard.writeText(scanData || '');
                  toast.success("Link copied to clipboard");
                }}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-12" asChild>
                  <a href={scanData || '#'} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Visit Destination
                  </a>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <style>{`
        @keyframes scan-beam {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}