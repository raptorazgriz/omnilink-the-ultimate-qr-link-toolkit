import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Copy, Share2, Palette, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
export function GeneratePage() {
  const [data, setData] = useState('https://omnilink.io');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [includeMargin, setIncludeMargin] = useState(true);
  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    toast.success("Data copied to clipboard!");
  };
  const handleDownload = () => {
    const svg = document.getElementById('qr-gen');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx?.drawImage(img, 0, 0, 512, 512);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'omnilink-qr.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    toast.success("QR Code downloaded!");
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <QrCode className="h-8 w-8 text-indigo-500" />
              QR Generator
            </h1>
            <p className="text-muted-foreground">Create custom, high-resolution QR codes in seconds.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Design & Content</CardTitle>
                  <CardDescription>Enter your data and customize the look of your QR code.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="text" className="flex items-center gap-2">
                        <Type className="h-4 w-4" /> Content
                      </TabsTrigger>
                      <TabsTrigger value="style" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" /> Appearance
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="qr-data">URL or Text Content</Label>
                        <Input 
                          id="qr-data" 
                          placeholder="e.g. https://your-website.com" 
                          value={data}
                          onChange={(e) => setData(e.target.value)}
                          className="bg-secondary"
                        />
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-muted-foreground/30">
                        <p className="text-sm text-muted-foreground">
                          Pro Tip: Shortened links make for simpler, more scannable QR codes.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="style" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Foreground Color</Label>
                          <div className="flex gap-2">
                            <Input 
                              type="color" 
                              value={fgColor} 
                              onChange={(e) => setFgColor(e.target.value)}
                              className="w-12 h-10 p-1 cursor-pointer"
                            />
                            <Input value={fgColor} readOnly className="bg-secondary flex-1" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Background Color</Label>
                          <div className="flex gap-2">
                            <Input 
                              type="color" 
                              value={bgColor} 
                              onChange={(e) => setBgColor(e.target.value)}
                              className="w-12 h-10 p-1 cursor-pointer"
                            />
                            <Input value={bgColor} readOnly className="bg-secondary flex-1" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <input 
                          type="checkbox" 
                          id="margin" 
                          checked={includeMargin} 
                          onChange={() => setIncludeMargin(!includeMargin)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <Label htmlFor="margin">Include quiet zone (margin)</Label>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="flex-1" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Content
                </Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Export PNG
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-12 space-y-4">
                <Card className="border-2 overflow-hidden bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                  <CardHeader className="text-center">
                    <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-bold">Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <motion.div 
                      layout
                      className="p-6 bg-white rounded-3xl shadow-2xl shadow-indigo-500/20"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${data}-${fgColor}-${bgColor}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <QRCodeSVG
                            id="qr-gen"
                            value={data || ' '}
                            size={256}
                            level="H"
                            bgColor={bgColor}
                            fgColor={fgColor}
                            includeMargin={includeMargin}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                    <div className="mt-8 text-center space-y-1">
                      <p className="text-sm font-medium text-indigo-500">Universal Scannability</p>
                      <p className="text-xs text-muted-foreground">Compatible with all standard QR readers</p>
                    </div>
                  </CardContent>
                </Card>
                <div className="p-4 bg-muted/20 border rounded-xl flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Our QR codes use Error Correction Level H, allowing up to 30% of the code to be obscured while remaining functional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}