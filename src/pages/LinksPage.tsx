import React, { useState } from 'react';
import { Link2, Plus, Copy, ExternalLink, TrendingUp, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
export function LinksPage() {
  const [url, setUrl] = useState('');
  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    toast.success("Link shortened successfully!", {
      description: "Added to your dashboard: omni.link/l/abc-123"
    });
    setUrl('');
  };
  const mockLinks = [
    { id: 1, title: 'Campaign Beta', original: 'https://marketing.acme.co/seasonal/summer-sale-2024?ref=email', short: 'omni.link/l/sumr24', clicks: 1245, trend: '+12%', created: 'May 12, 2024' },
    { id: 2, title: 'Portfolio Site', original: 'https://johndoe.design/works/project-x-case-study', short: 'omni.link/l/projectx', clicks: 890, trend: '+5%', created: 'May 10, 2024' },
    { id: 3, title: 'Feedback Form', original: 'https://forms.google.com/a/acme.co/d/1234567890abcdefg', short: 'omni.link/l/feedback', clicks: 432, trend: '-2%', created: 'May 08, 2024' },
    { id: 4, title: 'Internal Wiki', original: 'https://notion.so/acme/engineering/onboarding-guide-v2', short: 'omni.link/l/onboard', clicks: 128, trend: '+24%', created: 'May 05, 2024' },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Link2 className="h-8 w-8 text-indigo-500" />
                Link Management
              </h1>
              <p className="text-muted-foreground">Shorten, share and track your links globally.</p>
            </div>
          </div>
          <Card className="border-2 shadow-lg bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03]">
            <CardContent className="p-6">
              <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                  <Input 
                    placeholder="Paste your long URL here..." 
                    className="pl-11 h-14 text-lg bg-background rounded-2xl border-2 focus-visible:ring-indigo-500"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <Button type="submit" className="h-14 px-8 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                  Shorten Link <Plus className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Clicks', value: '2,695', change: '+14% this month' },
              { label: 'Active Links', value: '42', change: '2 created today' },
              { label: 'Top Destination', value: 'Campaign Beta', change: '46% of all traffic' },
            ].map((stat, i) => (
              <Card key={i} className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-500 font-medium flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search links..." className="pl-9 bg-secondary" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
            <Card className="border-2">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Link Destination</TableHead>
                    <TableHead>Short Link</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLinks.map((link) => (
                    <TableRow key={link.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-bold text-sm">{link.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[250px]">{link.original}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 cursor-pointer" onClick={() => {
                          navigator.clipboard.writeText(link.short);
                          toast.success("Short link copied!");
                        }}>
                          {link.short}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{link.clicks.toLocaleString()}</span>
                          <span className={`text-[10px] font-bold ${link.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {link.trend}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{link.created}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => toast.info("Viewing details...")}>
                              <TrendingUp className="mr-2 h-4 w-4" /> View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success("Copied!")}>
                              <Copy className="mr-2 h-4 w-4" /> Copy Short Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <a href={link.original} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> Visit Original
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}