import React, { useState, useRef } from 'react';
import { Scan, Camera, Upload, AlertCircle, RefreshCw, X, Link2, Copy, ExternalLink, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Scanner } from '@yudiel/react-qr-scanner';
import jsQR from 'jsqr';
export function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanData, setScanData] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleScan = (result: any) => {
    if (result?.[0]?.rawValue) {
      const data = result[0].rawValue;
      setScanData(data);
      setShowResult(true);
      setIsScanning(false);
      toast.success("Code detected via camera!");
    }
  };
  const handleError = (error: any) => {
    console.error(error);
    toast.error("Camera access failed. Check permissions.");
    setIsScanning(false);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        setIsProcessingFile(false);
        if (code) {
          setScanData(code.data);
          setShowResult(true);
          toast.success("QR Code decoded from image!");
        } else {
          toast.error("No valid QR code found in this image.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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
            <h1 className="text-3xl font-bold tracking-tight">QR Scanner Pro</h1>
            <p className="text-muted-foreground">High-performance local decoding via Camera or Gallery.</p>
          </div>
          {!isScanning ? (
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    className="h-44 flex flex-col gap-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                    onClick={() => setIsScanning(true)}
                  >
                    <Camera className="h-12 w-12" />
                    <span className="text-lg font-bold">Live Camera Scan</span>
                  </Button>
                  <div className="relative group">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      disabled={isProcessingFile}
                      className="h-44 w-full flex flex-col gap-4 border-2 border-dashed border-muted-foreground/30 rounded-3xl hover:bg-muted/50 transition-all hover:scale-[1.02]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isProcessingFile ? (
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      )}
                      <span className="text-lg font-bold">
                        {isProcessingFile ? 'Processing...' : 'Upload from Gallery'}
                      </span>
                    </Button>
                  </div>
                </div>
                <Alert className="mt-8 border-indigo-500/20 bg-indigo-500/5">
                  <AlertCircle className="h-4 w-4 text-indigo-500" />
                  <AlertTitle className="text-indigo-500">Privacy First</AlertTitle>
                  <AlertDescription>
                    All scanning operations occur entirely on your device. We never transmit your images or camera feed to any server.
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
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-center">
                <Button size="lg" variant="destructive" onClick={resetScanner} className="rounded-full shadow-lg h-14 w-14 p-0">
                  <X className="h-7 w-7" />
                </Button>
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
              </DialogHeader>
              <div className="bg-muted p-5 rounded-2xl break-all font-mono text-sm border shadow-inner max-h-40 overflow-y-auto">
                {scanData}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button variant="outline" className="rounded-xl h-12" onClick={() => {
                  navigator.clipboard.writeText(scanData || '');
                  toast.success("Copied to clipboard");
                }}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-12" asChild>
                  <a href={scanData || '#'} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Go to Link
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