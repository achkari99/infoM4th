"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, Users } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  title: string | null;
  role: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [query, setQuery] = useState("");
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const logAudit = async (action: string, targetId: string, detail: string) => {
    if (!user) return;
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action,
      target_type: "profile",
      target_id: targetId,
      detail,
    });
  };

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace("/login");
    }
  }, [sessionLoading, user, router]);

  useEffect(() => {
    const loadUsers = async () => {
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

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, title, role, created_at")
        .order("created_at", { ascending: false })
        .limit(80);

      if (error) {
        setStatusMessage(error.message);
        setIsLoading(false);
        return;
      }

      setProfiles((data as ProfileRow[]) ?? []);
      setIsLoading(false);
    };

    loadUsers();
  }, [user]);

  const updateRole = async (profile: ProfileRow, nextRole: string) => {
    setUpdatingRoleId(profile.id);
    const { error } = await supabase
      .from("profiles")
      .update({ role: nextRole })
      .eq("id", profile.id);

    if (error) {
      setStatusMessage(error.message);
      setUpdatingRoleId(null);
      return;
    }

    setProfiles((prev) =>
      prev.map((item) => (item.id === profile.id ? { ...item, role: nextRole } : item)),
    );

    await logAudit("role_change", profile.id, `Role set to ${nextRole}`);
    setUpdatingRoleId(null);
  };

  const filteredProfiles = useMemo(() => {
    const lowered = query.toLowerCase();
    return profiles.filter((profile) => {
      const name = profile.full_name ?? "";
      const email = profile.email ?? "";
      return name.toLowerCase().includes(lowered) || email.toLowerCase().includes(lowered);
    });
  }, [profiles, query]);

  if (sessionLoading || isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-muted-foreground uppercase tracking-[0.3em] text-xs">Loading users</div>
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
            Admin access is required to view user records.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-1 w-10 bg-primary/70" />
          Member Registry
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">Profiles synchronized from Supabase auth.</p>
          </div>
          <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6">Invite</Button>
        </div>
      </div>

      {statusMessage && (
        <div className="border border-border bg-card/60 text-muted-foreground text-sm px-4 py-3 rounded-2xl">
          {statusMessage}
        </div>
      )}

      <div className="flex items-center gap-4 bg-background/80 px-3 py-2 rounded-full border border-border max-w-md">
        <Search size={16} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      <div className="grid gap-4">
        {filteredProfiles.length === 0 ? (
          <div className="border border-border bg-card/60 text-muted-foreground p-6 rounded-2xl">
            No users match your search.
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="border border-border bg-card/60 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-foreground">
                    {profile.full_name || "Unnamed member"}
                  </h2>
                  {profile.role === "admin" && <ShieldCheck size={18} className="text-primary" />}
                </div>
                <p className="text-muted-foreground text-sm">{profile.email}</p>
                <p className="text-muted-foreground text-sm">
                  {profile.title || "Member"} ? Joined {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Users size={14} />
                {profile.role ?? "member"}
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs uppercase tracking-[0.2em] text-primary hover:text-foreground transition-colors disabled:opacity-40"
                    onClick={() => updateRole(profile, profile.role === "admin" ? "member" : "admin")}
                    disabled={updatingRoleId === profile.id}
                  >
                    {profile.role === "admin" ? "Demote" : "Promote"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
