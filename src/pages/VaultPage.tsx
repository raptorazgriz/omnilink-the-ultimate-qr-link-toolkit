import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, ExternalLink, Sparkles, FolderHeart } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
export function VaultPage() {
  const qrCodes = useQuery(api.qr.list) ?? [];
  const removeQr = useMutation(api.qr.remove);
  const handleDelete = async (qrId: any) => {
    try {
      await removeQr({ qrId });
      toast.success("Design deleted from vault");
    } catch (err) {
      toast.error("Failed to delete design");
    }
  };
  const handleDownload = (qrId: string, name: string, bgColor: string) => {
    const svg = document.getElementById(`qr-vault-${qrId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.drawImage(img, 0, 0, 1024, 1024);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <FolderHeart className="h-8 w-8 text-indigo-500" />
                Design Vault
              </h1>
              <p className="text-muted-foreground">Manage your saved high-resolution QR branding assets.</p>
            </div>
            <Badge variant="outline" className="px-4 py-1 text-sm bg-indigo-500/5 text-indigo-500 border-indigo-500/20">
              {qrCodes.length} Stored Assets
            </Badge>
          </div>
          {qrCodes.length === 0 && (
            <Card className="border-2 border-dashed p-20 text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Trash2 className="h-10 w-10 text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-2">
                <CardTitle>Vault is Empty</CardTitle>
                <CardDescription>Start by generating and saving custom QR codes from the Generator.</CardDescription>
              </div>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                <a href="/generate">Go to Generator</a>
              </Button>
            </Card>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {qrCodes.map((qr, index) => (
              <motion.div
                key={qr._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full border-2 hover:border-indigo-500/50 transition-all group overflow-hidden bg-card/50">
                  <div className="p-6 bg-white flex items-center justify-center border-b aspect-square relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-40 transition-opacity" />
                    <QRCodeSVG
                      id={`qr-vault-${qr._id}`}
                      value={qr.data}
                      size={200}
                      level="H"
                      bgColor={qr.design.bgColor}
                      fgColor={qr.design.fgColor}
                      includeMargin={qr.design.includeMargin}
                    />
                  </div>
                  <CardHeader className="p-4 space-y-1">
                    <CardTitle className="text-base truncate">{qr.name}</CardTitle>
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                      <span>{format(qr.createdAt, 'MMM dd, yyyy')}</span>
                      <span className="text-indigo-500">Cloud Saved</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1 rounded-xl"
                      onClick={() => handleDownload(qr._id, qr.name, qr.design.bgColor)}
                    >
                      <Download className="h-4 w-4 mr-1.5" /> PNG
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 rounded-xl"
                      asChild
                    >
                      <a href={qr.data} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="rounded-xl px-2.5"
                      onClick={() => handleDelete(qr._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}