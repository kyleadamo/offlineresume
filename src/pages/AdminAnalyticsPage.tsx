import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

const KEY_STORAGE = 'admin_analytics_key';

interface Summary {
  totals: {
    uniqueVisitors: number;
    pageViews: number;
    resumesCreated: number;
    pdfDownloads: number;
    pdfRemote: number;
    pdfBrowserPrint: number;
  };
  last30Days: {
    uniqueVisitors: number;
    pageViews: number;
    resumesCreated: number;
    pdfDownloads: number;
  };
  topTemplates: { template_id: string; count: number }[];
  daily: { date: string; visitors: number; pdf: number; created: number }[];
  eventsSampled: number;
}

export default function AdminAnalyticsPage() {
  const [key, setKey] = useState<string>(() => sessionStorage.getItem(KEY_STORAGE) ?? '');
  const [authed, setAuthed] = useState<boolean>(!!sessionStorage.getItem(KEY_STORAGE));
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (k: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('analytics-summary', {
        headers: { 'x-admin-key': k },
      });
      if (error) throw error;
      setData(data as Summary);
      sessionStorage.setItem(KEY_STORAGE, k);
      setAuthed(true);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load');
      setAuthed(false);
      sessionStorage.removeItem(KEY_STORAGE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed && key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="password"
              placeholder="Admin key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && key && load(key)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={() => load(key)} disabled={!key || loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const stat = (label: string, value: number, sub?: string) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value.toLocaleString()}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Sampled {data.eventsSampled.toLocaleString()} most recent events
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            sessionStorage.removeItem(KEY_STORAGE);
            setAuthed(false);
            setKey('');
            setData(null);
          }}
        >
          Sign out
        </Button>
      </header>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          All time
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stat('Unique visitors', data.totals.uniqueVisitors)}
          {stat('Page views', data.totals.pageViews)}
          {stat('Resumes created', data.totals.resumesCreated)}
          {stat(
            'PDF downloads',
            data.totals.pdfDownloads,
            `${data.totals.pdfRemote} remote · ${data.totals.pdfBrowserPrint} print`,
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Last 30 days
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stat('Unique visitors', data.last30Days.uniqueVisitors)}
          {stat('Page views', data.last30Days.pageViews)}
          {stat('Resumes created', data.last30Days.resumesCreated)}
          {stat('PDF downloads', data.last30Days.pdfDownloads)}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily activity (last 30 days)</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.daily.slice(-30)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="created" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pdf" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top templates by PDF download</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topTemplates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No downloads yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.topTemplates.map((t) => (
                <li key={t.template_id} className="flex justify-between py-2 text-sm">
                  <span className="capitalize">{t.template_id}</span>
                  <span className="font-medium">{t.count.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
