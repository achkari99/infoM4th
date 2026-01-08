"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

interface ProfileSettings {
  id: string;
  full_name: string | null;
  email: string | null;
  title: string | null;
  location: string | null;
  timezone: string | null;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace("/login");
    }
  }, [sessionLoading, user, router]);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      setIsLoading(true);
      setStatusMessage(null);

      const { data: roleRow, error: roleError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (roleError) {
        setStatusMessage(roleError.message);
        setIsLoading(false);
        return;
      }

      if (roleRow?.role !== "admin") {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, title, location, timezone")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setStatusMessage(error.message);
        setIsLoading(false);
        return;
      }

      setProfile((data as ProfileSettings) ?? null);
      setIsLoading(false);
    };

    loadSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!profile) return;
    setIsSaving(true);
    setStatusMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        title: profile.title,
        location: profile.location,
        timezone: profile.timezone,
      })
      .eq("id", profile.id);

    if (error) {
      setStatusMessage(error.message);
      setIsSaving(false);
      return;
    }

    setStatusMessage("Settings saved.");
    setIsSaving(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-zinc-500 uppercase tracking-[0.3em] text-xs">Loading settings</div>
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
            Admin access is required to adjust settings.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
        <span className="h-1 w-10 bg-primary/70" />
        Admin Controls
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-zinc-500">Personalize your admin presence.</p>
        </div>
        <Settings size={20} className="text-primary" />
      </div>

      {statusMessage && (
        <div className="border border-zinc-800 bg-zinc-900/60 text-zinc-300 text-sm px-4 py-3 rounded-2xl">
          {statusMessage}
        </div>
      )}

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Profile Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">Name</label>
              <Input
                value={profile?.full_name ?? ""}
                onChange={(event) =>
                  setProfile((prev) => (prev ? { ...prev, full_name: event.target.value } : prev))
                }
                className="mt-2 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">Title</label>
              <Input
                value={profile?.title ?? ""}
                onChange={(event) =>
                  setProfile((prev) => (prev ? { ...prev, title: event.target.value } : prev))
                }
                className="mt-2 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">Location</label>
              <Input
                value={profile?.location ?? ""}
                onChange={(event) =>
                  setProfile((prev) => (prev ? { ...prev, location: event.target.value } : prev))
                }
                className="mt-2 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">Timezone</label>
              <Input
                value={profile?.timezone ?? ""}
                onChange={(event) =>
                  setProfile((prev) => (prev ? { ...prev, timezone: event.target.value } : prev))
                }
                className="mt-2 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={saveSettings}
              className="bg-white text-black hover:bg-zinc-200 rounded-full px-6"
              disabled={isSaving}
            >
              {isSaving ? "Saving?" : "Save changes"}
            </Button>
            <Button variant="ghost" className="text-zinc-400" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
