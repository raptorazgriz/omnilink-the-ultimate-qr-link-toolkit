import React, { useState, useMemo } from 'react';
import { Link2, Plus, Copy, ExternalLink, TrendingUp, Search, Filter, MoreHorizontal, Loader2, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { format, isToday } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export function LinksPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<any>(null);
  const links = useQuery(api.links.list) ?? [];
  const createLink = useMutation(api.links.create);
  const deleteLink = useMutation(api.links.remove);
  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsSubmitting(true);
    try {
      await createLink({
        title: title || 'Untitled Link',
        originalUrl: url
      });
      toast.success("Short URL generated!");
      setUrl('');
      setTitle('');
    } catch (err) {
      toast.error("Unauthorized. Please sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const confirmDelete = async () => {
    if (!linkToDelete) return;
    try {
      await deleteLink({ linkId: linkToDelete._id });
      toast.success("Link purged from system");
      setLinkToDelete(null);
    } catch (err) {
      toast.error("Failed to delete link");
    }
  };
  const filteredLinks = useMemo(() => {
    return links.filter(l => 
      l.title.toLowerCase().includes(search.toLowerCase()) || 
      l.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      l.originalUrl.toLowerCase().includes(search.toLowerCase())
    );
  }, [links, search]);
  const stats = useMemo(() => {
    const total = links.reduce((acc, curr) => acc + curr.clicks, 0);
    const today = links.reduce((acc, curr) => acc + (isToday(curr.createdAt) ? 1 : 0), 0); // Simplified metric
    return { total, today };
  }, [links]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Link2 className="h-8 w-8 text-indigo-500" />
              Link Management
            </h1>
            <p className="text-muted-foreground">Secure your destination URLs and monitor conversion rates.</p>
          </div>
          <Card className="border-2 shadow-lg bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03]">
            <CardContent className="p-6">
              <form onSubmit={handleShorten} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Reference Name (e.g. Bio Link)"
                    className="h-14 bg-background rounded-2xl border-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="relative group flex-1">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Destination URL..."
                      className="pl-12 h-14 bg-background rounded-2xl border-2"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="h-14 w-full text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Shorten & Secure'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Hits', value: stats.total.toLocaleString(), icon: TrendingUp, color: 'text-indigo-500' },
              { label: 'Vault Inventory', value: links.length.toString(), icon: Link2, color: 'text-blue-500' },
              { label: 'New Links Today', value: stats.today.toString(), icon: Calendar, color: 'text-emerald-500' },
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
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filter links..." 
                className="pl-9 bg-secondary" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Card className="border-2 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Asset Name</TableHead>
                    <TableHead>Secure Path</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link) => (
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
                            toast.success("Short URL copied");
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
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/l/${link.shortCode}`);
                              toast.success("URL in clipboard");
                            }}>
                              <Copy className="mr-2 h-4 w-4" /> Copy Access Path
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> Open Destination
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => setLinkToDelete(link)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Destroy Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredLinks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        Empty result set for link repository.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
      <AlertDialog open={!!linkToDelete} onOpenChange={(open) => !open && setLinkToDelete(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the short link and all associated click analytics. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl" onClick={confirmDelete}>
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}