"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  type: "join" | "member";
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace("/login");
    }
  }, [sessionLoading, user, router]);

  useEffect(() => {
    const loadNotifications = async () => {
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

      const [{ data: joinRows }, { data: newProfiles }] = await Promise.all([
        supabase
          .from("join_requests")
          .select("id, name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("profiles")
          .select("id, full_name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      const joinAlerts = (joinRows ?? []).map((row) => ({
        id: row.id,
        title: "New join request",
        detail: `${row.name} ? ${row.email}`,
        timestamp: new Date(row.created_at).toLocaleString(),
        type: "join" as const,
      }));

      const memberAlerts = (newProfiles ?? []).map((row) => ({
        id: row.id,
        title: "New member confirmed",
        detail: `${row.full_name || "New profile"} ? ${row.email}`,
        timestamp: new Date(row.created_at).toLocaleString(),
        type: "member" as const,
      }));

      const merged = [...joinAlerts, ...memberAlerts].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      setNotifications(merged.slice(0, 10));
      setIsLoading(false);
    };

    loadNotifications();
  }, [user]);

  const iconForType = useMemo(
    () => ({
      join: <Mail size={18} className="text-primary" />,
      member: <UserPlus size={18} className="text-primary" />,
    }),
    [],
  );

  if (sessionLoading || isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-zinc-500 uppercase tracking-[0.3em] text-xs">Loading notifications</div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Access restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-400">
            Admin access is required to view notifications.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
        <span className="h-1 w-10 bg-primary/70" />
        System Notices
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-zinc-500">All admin-visible system signals in one feed.</p>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
          <Bell size={14} className="text-primary" />
          Quiet mode
        </div>
      </div>

      {statusMessage && (
        <div className="border border-zinc-800 bg-zinc-900/60 text-zinc-300 text-sm px-4 py-3 rounded-2xl">
          {statusMessage}
        </div>
      )}

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="text-zinc-500 p-6">No notifications yet.</CardContent>
          </Card>
        ) : (
          notifications.map((notice) => (
            <Card key={notice.id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center">
                  {iconForType[notice.type]}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-6">
                    <h2 className="text-white font-semibold">{notice.title}</h2>
                    <span className="text-xs text-zinc-500">{notice.timestamp}</span>
                  </div>
                  <p className="text-zinc-400 text-sm">{notice.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
