"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, Plus } from "lucide-react";
import Image from "next/image";
import popArtImage from "@/../attached_assets/ChatGPT_Image_Dec_31,_2025,_07_39_12_PM_1767368748048.png";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
}

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  major: string;
  message: string;
  status: string | null;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: "--",
    newUsers: "--",
    events: "--",
    joinRequests: "--",
    systemHealth: "Stable",
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace("/login");
    }
  }, [sessionLoading, user, router]);

  const loadAdminData = useCallback(async () => {
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

    const role = profile?.role;
    if (role !== "admin") {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    setIsAuthorized(true);

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: usersCount },
      { count: newUsersCount },
      { count: eventsCount },
      { count: joinCount },
      { data: recentProfiles },
      { data: recentJoins },
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", cutoff),
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("join_requests").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id, full_name, created_at")
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("join_requests")
        .select("id, name, email, major, message, status, created_at")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

    const derivedActivity = (recentProfiles ?? []).map((item) => ({
      id: item.id,
      title: "New member joined",
      detail: item.full_name || "New profile",
      timestamp: new Date(item.created_at).toLocaleString(),
    }));

    setStats({
      totalUsers: usersCount?.toString() ?? "--",
      newUsers: newUsersCount?.toString() ?? "--",
      events: eventsCount?.toString() ?? "--",
      joinRequests: joinCount?.toString() ?? "--",
      systemHealth: "Stable",
    });
    setActivity(derivedActivity);
    setJoinRequests((recentJoins as JoinRequest[]) ?? []);
    setLastSync(new Date());
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadAdminData();
    if (!user) return;

    const interval = setInterval(() => {
      loadAdminData();
    }, 45000);

    return () => clearInterval(interval);
  }, [loadAdminData, user]);

  const updateJoinStatus = async (id: string, status: string) => {
    setUpdatingRequestId(id);
    const { error } = await supabase
      .from("join_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      setStatusMessage(error.message);
      setUpdatingRequestId(null);
      return;
    }

    setJoinRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    setUpdatingRequestId(null);
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-zinc-500 uppercase tracking-[0.3em] text-xs">Loading admin system</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <Card className="bg-zinc-900 border-zinc-800 max-w-lg">
          <CardHeader>
            <CardTitle className="text-white">Access restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-400">
            This console is limited to admins. If you believe this is a mistake, contact the system owner.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
              <span className="h-1 w-10 bg-primary/70" />
              Command Center
            </div>
            <h1 className="text-3xl font-bold">Admin Console</h1>
            <p className="text-zinc-500">Calm oversight, quiet momentum.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 border border-zinc-800 rounded-full px-4 py-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
              <Activity size={14} className="text-primary" />
              Live sync
              <span className="text-zinc-600">
                {lastSync
                  ? lastSync.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                  : "Syncing"}
              </span>
            </div>
            <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 flex items-center gap-2">
              <Plus size={18} />
              New Report
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-zinc-900/80 bg-zinc-950/80 px-4 py-3 rounded-2xl">
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Secure channel
            </span>
            <span className="hidden sm:inline">Admin visibility only</span>
          </div>
          <div className="text-xs text-zinc-500">
            Last refresh: {lastSync ? lastSync.toLocaleString() : "Waiting for data"}
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="border border-zinc-800 bg-zinc-900/60 text-zinc-300 text-sm px-4 py-3 rounded-2xl">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: "Total Users", value: stats.totalUsers, change: "" },
          { label: "New Users (24h)", value: stats.newUsers, change: "" },
          { label: "Events", value: stats.events, change: "" },
          { label: "Join Requests", value: stats.joinRequests, change: "" },
          { label: "System Health", value: stats.systemHealth, change: "Stable" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <span className="text-zinc-500 text-sm font-medium">{stat.label}</span>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                {stat.change && <span className="text-emerald-500 text-sm font-bold">{stat.change}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activity.length === 0 ? (
                <div className="text-zinc-500">No recent activity yet.</div>
              ) : (
                activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Users className="text-zinc-400" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-sm text-zinc-500">{item.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">{item.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Join Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {joinRequests.length === 0 ? (
                <div className="text-zinc-500">No new requests yet.</div>
              ) : (
                <div className="space-y-4">
                  {joinRequests.map((request) => (
                    <div key={request.id} className="border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{request.name}</p>
                          <p className="text-sm text-zinc-500">{request.major}</p>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-2">{request.message}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                          {request.status ?? "new"}
                        </span>
                        <button
                          className="text-xs uppercase tracking-[0.2em] text-emerald-300 hover:text-emerald-200 transition-colors disabled:opacity-40"
                          onClick={() => updateJoinStatus(request.id, "approved")}
                          disabled={updatingRequestId === request.id}
                        >
                          Approve
                        </button>
                        <button
                          className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                          onClick={() => updateJoinStatus(request.id, "declined")}
                          disabled={updatingRequestId === request.id}
                        >
                          Decline
                        </button>
                        <a
                          href={`mailto:${request.email}`}
                          className="text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                        >
                          Reply
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-2xl overflow-hidden relative group aspect-square">
            <Image
              src={popArtImage}
              alt="System Status"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white">System Pulse</h3>
              <p className="text-zinc-400 text-sm">All regions operational.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
