import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Scan, Link2, TrendingUp, ArrowRight, Zap, Shield, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SignOutButton } from '@/components/SignOutButton';
import { Badge } from '@/components/ui/badge';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Authenticated, Unauthenticated } from 'convex/react';
import { SignInForm } from '@/components/SignInForm';
import { formatDistanceToNow } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const quickActions = [
  {
    title: "QR Generator",
    description: "Create premium, customizable QR codes with cloud storage.",
    icon: QrCode,
    path: "/generate",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    title: "QR Scanner",
    description: "Hardware-accelerated scanning from any modern device.",
    icon: Scan,
    path: "/scan",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "Design Vault",
    description: "Your secure repository for high-res QR branding assets.",
    icon: Shield,
    path: "/vault",
    gradient: "from-emerald-500 to-teal-600"
  }
];
export function HomePage() {
  const user = useQuery(api.auth.loggedInUser);
  const links = useQuery(api.links.list) ?? [];
  const qrCodes = useQuery(api.qr.list) ?? [];
  const analytics = useQuery(api.links.getAnalytics) ?? [];
  const totalClicks = links.reduce((acc, curr) => acc + curr.clicks, 0);
  const activity = [
    ...links.map(l => ({ id: l._id, type: 'Link', name: l.title, date: l.createdAt, data: `/${l.shortCode}`, hits: l.clicks })),
    ...qrCodes.map(q => ({ id: q._id, type: 'QR', name: q.name, date: q.createdAt, data: q.data, hits: null }))
  ].sort((a, b) => b.date - a.date).slice(0, 5);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome, <span className="text-indigo-500">{user?.name || 'Explorer'}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl text-pretty">
              Comprehensive analytics and asset management at your fingertips.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle className="static" />
            <Authenticated>
              <SignOutButton />
            </Authenticated>
          </div>
        </div>
        <Unauthenticated>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                The Future of Connectivity
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Connect your brand <br />
                <span className="text-indigo-500">to the world instantly.</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Fastest redirection in the cloud" },
                  { icon: Shield, text: "Highly customizable brand QR assets" },
                  { icon: TrendingUp, text: "Deep engagement analytics included" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                      <feature.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border-2 rounded-3xl p-8 shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
              <CardTitle className="text-2xl mb-6 relative">Sign in to Get Started</CardTitle>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
        <Authenticated>
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <Link key={action.path} to={action.path} className="group">
                  <Card className="h-full border-2 hover:border-indigo-500 transition-all duration-300 overflow-hidden relative glass shadow-sm hover:shadow-indigo-500/10">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity blur-3xl`} />
                    <CardHeader className="relative">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="group-hover:text-indigo-500 transition-colors">{action.title}</CardTitle>
                      <CardDescription className="text-pretty">{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center text-indigo-500 font-bold text-sm">
                      Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-2 overflow-hidden shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Engagement Trends</CardTitle>
                    <CardDescription>Click activity across the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] w-full pr-4">
                    {analytics.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics}>
                          <defs>
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                            itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <TrendingUp className="h-10 w-10 mb-2 opacity-20" />
                        <p>Accumulating engagement data...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Recent Operations</CardTitle>
                      <CardDescription>Live history of your digital assets</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {activity.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.type === 'Link' ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'}`}>
                              {item.type === 'Link' ? <Link2 className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{item.data}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col gap-1">
                            <p className="text-xs font-black uppercase tracking-tighter text-indigo-500">
                              {item.hits !== null ? `${item.hits} Hits` : 'Stored'}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                              {formatDistanceToNow(item.date)} ago
                            </p>
                          </div>
                        </div>
                      ))}
                      {activity.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                          <Zap className="h-10 w-10 mx-auto mb-4 opacity-20" />
                          <p>Your activity feed is empty. Start by creating a link or QR code.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="border-2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-[0.2em] font-black opacity-80">Global Reach</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-8">
                    <div className="space-y-1">
                      <div className="text-5xl font-black tracking-tighter">{totalClicks.toLocaleString()}</div>
                      <div className="text-xs font-bold uppercase opacity-60">Cumulative Engagements</div>
                    </div>
                    <div className="h-px bg-white/10 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-0.5">
                        <div className="text-2xl font-bold">{links.length}</div>
                        <div className="text-[10px] uppercase font-bold opacity-60">Cloud Links</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-2xl font-bold">{qrCodes.length}</div>
                        <div className="text-[10px] uppercase font-bold opacity-60">QR Designs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-dashed bg-muted/20">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto">
                      <Shield className="h-6 w-6 text-indigo-500" />
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                      OmniLink infrastructure ensures 99.9% uptime for your critical redirection paths.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Authenticated>
        <footer className="pt-12 text-center text-muted-foreground border-t border-muted/50">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40">OmniLink Pro • Release 2.5.0</p>
        </footer>
      </div>
    </div>
  );
}