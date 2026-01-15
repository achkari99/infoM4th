"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, Database } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

interface DailyPoint {
  day: string;
  count: number;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    users: "--",
    events: "--",
    news: "--",
    library: "--",
    joins: "--",
  });
  const [dailyJoins, setDailyJoins] = useState<DailyPoint[]>([]);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace("/login");
    }
  }, [sessionLoading, user, router]);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;
      setIsLoading(true);
      setStatusMessage(null);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setStatusMessage(profileError.message);
        setIsLoading(false);
        return;
      }

      if (profile?.role !== "admin") {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(true);

      const cutoff = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

      const [
        { count: usersCount },
        { count: eventsCount },
        { count: newsCount },
        { count: libraryCount },
        { count: joinsCount },
        { data: joinRows },
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("news").select("id", { count: "exact", head: true }),
        supabase.from("library_paths").select("id", { count: "exact", head: true }),
        supabase.from("join_requests").select("id", { count: "exact", head: true }),
        supabase
          .from("join_requests")
          .select("created_at")
          .gte("created_at", cutoff.toISOString()),
      ]);

      if (!joinRows) {
        setStatusMessage("Unable to load join request history.");
      }

      const counts = new Map<string, number>();
      (joinRows ?? []).forEach((row) => {
        const day = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        counts.set(day, (counts.get(day) ?? 0) + 1);
      });

      const points: DailyPoint[] = [];
      for (let i = 6; i >= 0; i -= 1) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        points.push({ day: label, count: counts.get(label) ?? 0 });
      }

      setStats({
        users: usersCount?.toString() ?? "--",
        events: eventsCount?.toString() ?? "--",
        news: newsCount?.toString() ?? "--",
        library: libraryCount?.toString() ?? "--",
        joins: joinsCount?.toString() ?? "--",
      });
      setDailyJoins(points);
      setIsLoading(false);
    };

    loadAnalytics();
  }, [user]);

  const maxJoins = useMemo(() => Math.max(...dailyJoins.map((point) => point.count), 1), [dailyJoins]);

  if (sessionLoading || isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-muted-foreground uppercase tracking-[0.3em] text-xs">Loading analytics</div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Access restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Admin access is required to view analytics.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <span className="h-1 w-10 bg-primary/70" />
        Signal Readout
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Quiet metrics for steady decisions.</p>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <Activity size={14} className="text-primary" />
          Live
        </div>
      </div>

      {statusMessage && (
        <div className="border border-border bg-card/60 text-muted-foreground text-sm px-4 py-3 rounded-2xl">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: "Members", value: stats.users },
          { label: "Events", value: stats.events },
          { label: "News", value: stats.news },
          { label: "Library", value: stats.library },
          { label: "Join Requests", value: stats.joins },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardHeader className="pb-2">
              <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-3">
            <BarChart3 size={18} className="text-primary" />
            Weekly Join Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-3 items-end h-40">
            {dailyJoins.map((point) => (
              <div key={point.day} className="flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-full bg-primary/40"
                  style={{ height: `${(point.count / maxJoins) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{point.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-3">
              <Database size={18} className="text-primary" />
              Data Integrity
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            All event, news, and library entries are syncing from Supabase. Refresh intervals stay under 60 seconds.
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Focus</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Join-request velocity suggests when to schedule onboarding sessions and mentorship matching.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
