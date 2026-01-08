"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

interface AuditRow {
  id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  detail: string | null;
  created_at: string;
}

export default function AdminAuditPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<AuditRow[]>([]);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace("/login");
    }
  }, [sessionLoading, user, router]);

  useEffect(() => {
    const loadAudit = async () => {
      if (!user) return;
      setIsLoading(true);
      setStatusMessage(null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role != "admin") {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(true);

      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) {
        setStatusMessage(error.message);
        setIsLoading(false);
        return;
      }

      setLogs((data as AuditRow[]) ?? []);
      setIsLoading(false);
    };

    loadAudit();
  }, [user]);

  if (sessionLoading || isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-zinc-500 uppercase tracking-[0.3em] text-xs">Loading audit log</div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Access restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-400">Admin access is required to view audit logs.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
        <span className="h-1 w-10 bg-primary/70" />
        Security Ledger
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-zinc-500">Every admin action, quietly recorded.</p>
        </div>
        <Shield size={20} className="text-primary" />
      </div>

      {statusMessage && (
        <div className="border border-zinc-800 bg-zinc-900/60 text-zinc-300 text-sm px-4 py-3 rounded-2xl">
          {statusMessage}
        </div>
      )}

      <div className="space-y-4">
        {logs.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="text-zinc-500 p-6">No audit events yet.</CardContent>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500">
                  <span>{log.action}</span>
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </div>
                <div className="text-white font-medium">{log.detail ?? "Action recorded"}</div>
                <div className="text-xs text-zinc-500">
                  {log.target_type ?? "system"} {log.target_id ?? ""}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
