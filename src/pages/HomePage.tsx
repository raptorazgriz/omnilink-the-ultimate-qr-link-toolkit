import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Scan, Link2, TrendingUp, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SignOutButton } from '@/components/SignOutButton';
import { Badge } from '@/components/ui/badge';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Authenticated, Unauthenticated } from 'convex/react';
import { SignInForm } from '@/components/SignInForm';
const quickActions = [
  {
    title: "QR Generator",
    description: "Create premium, customizable QR codes for any data.",
    icon: QrCode,
    path: "/generate",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    title: "QR Scanner",
    description: "Lightning-fast scanning from camera or file uploads.",
    icon: Scan,
    path: "/scan",
    color: "bg-purple-500",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "Link Shortener",
    description: "Shorten URLs and track click analytics in real-time.",
    icon: Link2,
    path: "/links",
    color: "bg-orange-500",
    gradient: "from-orange-500 to-red-600"
  }
];
export function HomePage() {
  const user = useQuery(api.auth.loggedInUser);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome to <span className="text-indigo-500">OmniLink</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              The professional-grade toolkit for generating QR codes, scanning instantly, and managing shortened links with deep analytics.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
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
                Empowering your digital presence
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                One platform. <br />
                <span className="text-indigo-500">Infinite connections.</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Instant link shortening & redirection" },
                  { icon: Shield, text: "Secure, highly-compatible QR encoding" },
                  { icon: TrendingUp, text: "Real-time engagement tracking" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                      <feature.icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border rounded-3xl p-8 shadow-2xl shadow-indigo-500/10">
              <CardTitle className="text-2xl mb-6">Get Started</CardTitle>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
        <Authenticated>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <Link key={action.path} to={action.path} className="group">
                  <Card className="h-full border-2 hover:border-indigo-500 transition-all duration-300 overflow-hidden relative glass">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity blur-3xl`} />
                    <CardHeader className="relative">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="group-hover:text-indigo-500 transition-colors">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center text-indigo-500 font-medium text-sm">
                      Try now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <Card className="overflow-hidden border-2">
              <CardHeader className="bg-muted/30 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest generated links and scanned codes</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/links">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    { type: 'Link', name: 'Product Launch 2024', date: '2 hours ago', status: 'Active', data: 'omni.link/l/prod-24' },
                    { type: 'QR', name: 'Coffee Shop WiFi', date: '5 hours ago', status: 'Generated', data: 'WIFI:T:WPA;S:BeanScene...' },
                    { type: 'Link', name: 'Portfolio Portfolio', date: 'Yesterday', status: 'Active', data: 'omni.link/l/myportfolio' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.type === 'Link' ? 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}`}>
                          {item.type === 'Link' ? <Link2 className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.data}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.status}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Authenticated>
        <footer className="pt-12 text-center text-muted-foreground border-t">
          <p className="text-sm">© 2024 OmniLink Professional. Securely processed by Convex.</p>
        </footer>
      </div>
    </div>
  );
}