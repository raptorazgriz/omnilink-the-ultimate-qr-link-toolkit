import React, { useState } from 'react';
import { Link2, Plus, Copy, ExternalLink, TrendingUp, Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { format } from 'date-fns';
export function LinksPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const links = useQuery(api.links.list) ?? [];
  const createLink = useMutation(api.links.create);
  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsSubmitting(true);
    try {
      const result = await createLink({
        title: title || 'Untitled Link',
        originalUrl: url
      });
      toast.success("Link shortened successfully!", {
        description: `Your code: ${result.shortCode}`
      });
      setUrl('');
      setTitle('');
    } catch (err) {
      toast.error("Failed to shorten link. Ensure you are signed in.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const totalClicks = links.reduce((acc, curr) => acc + curr.clicks, 0);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Link2 className="h-8 w-8 text-indigo-500" />
              Link Management
            </h1>
            <p className="text-muted-foreground">Manage your shortened URLs and monitor real-time engagement.</p>
          </div>
          <Card className="border-2 shadow-lg bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03]">
            <CardContent className="p-6">
              <form onSubmit={handleShorten} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <Input
                      placeholder="Display Name (e.g. Summer Sale)"
                      className="h-14 bg-background rounded-2xl border-2 focus-visible:ring-indigo-500"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="relative group flex-1">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Paste destination URL..."
                      className="pl-12 h-14 bg-background rounded-2xl border-2 focus-visible:ring-indigo-500"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="h-14 w-full text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Create Short Link <Plus className="ml-2 h-5 w-5" /></>}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Cloud Reach', value: totalClicks.toLocaleString(), icon: TrendingUp, color: 'text-green-500' },
              { label: 'Active Vault', value: links.length.toString(), icon: Link2, color: 'text-indigo-500' },
              { label: 'Peak Performance', value: links.length > 0 ? links[0].title : 'N/A', icon: TrendingUp, color: 'text-blue-500' },
            ].map((stat, i) => (
              <Card key={i} className="border-2 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search link database..." className="pl-9 bg-secondary" />
              </div>
            </div>
            <Card className="border-2 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Destination</TableHead>
                    <TableHead>Short Path</TableHead>
                    <TableHead>Hits</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link._id} className="group hover:bg-muted/20">
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm">{link.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.originalUrl}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 cursor-pointer transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/l/${link.shortCode}`);
                            toast.success("Short URL copied!");
                          }}
                        >
                          /{link.shortCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-sm">{link.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(link.createdAt, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/l/${link.shortCode}`);
                              toast.success("Copied!");
                            }}>
                              <Copy className="mr-2 h-4 w-4" /> Copy Short Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> Visit Destination
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {links.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No links in the vault yet. Create your first one above!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}