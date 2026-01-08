"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  ShieldCheck,
  Clock,
  MapPin,
  Camera,
  Edit2,
  Save,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import popArtImage from "@/../attached_assets/ChatGPT_Image_Dec_31,_2025,_07_39_12_PM_1767368748048.png";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  title: string | null;
  bio: string | null;
  location: string | null;
  timezone: string | null;
  avatar_url: string | null;
  socials: string[] | null;
  projects_completed: number | null;
  rank: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSupabaseSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formState, setFormState] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const socials = useMemo(() => {
    if (profile?.socials && profile.socials.length > 0) return profile.socials;
    return ["Twitter", "LinkedIn", "GitHub"];
  }, [profile?.socials]);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace("/login");
    }
  }, [sessionLoading, user, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setStatusMessage(error.message);
      }

      const fallbackProfile: Profile = {
        id: user.id,
        full_name: user.user_metadata?.full_name ?? user.email ?? "",
        email: user.email ?? "",
        title: null,
        bio: null,
        location: null,
        timezone: null,
        avatar_url: null,
        socials: null,
        projects_completed: null,
        rank: null,
      };

      const mergedProfile = { ...fallbackProfile, ...(data ?? {}) } as Profile;
      setProfile(mergedProfile);
      setFormState(mergedProfile);
      setIsLoading(false);
    };

    loadProfile();
  }, [user]);

  const startEditing = () => {
    setFormState(profile);
    setIsEditing(true);
    setStatusMessage(null);
  };

  const cancelEditing = () => {
    setFormState(profile);
    setIsEditing(false);
    setStatusMessage("Edits discarded.");
  };

  const saveProfile = async () => {
    if (!formState) return;
    setIsSaving(true);
    setStatusMessage(null);

    const { error } = await supabase.from("profiles").upsert({
      id: formState.id,
      full_name: formState.full_name,
      email: formState.email,
      title: formState.title,
      bio: formState.bio,
      location: formState.location,
      timezone: formState.timezone,
      avatar_url: formState.avatar_url,
      socials: formState.socials,
      projects_completed: formState.projects_completed,
      rank: formState.rank,
    });

    if (error) {
      setStatusMessage(error.message);
      setIsSaving(false);
      return;
    }

    setProfile(formState);
    setIsEditing(false);
    setIsSaving(false);
    setStatusMessage("Profile updated.");
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setStatusMessage(null);

    const extension = file.name.split(".").pop();
    const filePath = `${user.id}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setStatusMessage(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    setFormState((prev) => (prev ? { ...prev, avatar_url: publicUrl.publicUrl } : prev));
    setUploading(false);
    setStatusMessage("Avatar updated. Save to apply.");
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
        <div className="max-w-5xl mx-auto animate-pulse space-y-8">
          <div className="h-40 bg-zinc-900 rounded-3xl" />
          <div className="h-32 bg-zinc-900 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800 max-w-lg">
          <CardHeader>
            <CardTitle className="text-white">Profile unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-400">
            We could not load your profile right now. Try again or return to the homepage.
            <div className="mt-4">
              <Link href="/">
                <Button className="bg-white text-black hover:bg-zinc-200">Go Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const avatarUrl = formState?.avatar_url;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="relative group">
          <div className="h-48 md:h-64 w-full rounded-3xl overflow-hidden relative">
            <Image
              src={popArtImage}
              alt="Cover"
              fill
              className="object-cover blur-sm opacity-50 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
          </div>

          <div className="absolute -bottom-8 left-8 flex items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-zinc-900 border-4 border-zinc-950 overflow-hidden shadow-2xl relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Image src={popArtImage} alt="Avatar" fill className="object-cover" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-2 bg-white text-black rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="pb-4 space-y-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                {profile.full_name || "InfoM4th Member"}
                <ShieldCheck className="text-blue-500" size={24} />
              </h1>
              <p className="text-zinc-400 font-medium">{profile.title || "Member"}</p>
            </div>
          </div>

          <div className="absolute top-4 right-4 md:top-auto md:bottom-4 md:right-8 flex gap-3">
            {!isEditing ? (
              <Button
                onClick={startEditing}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-zinc-700 flex items-center gap-2 rounded-full px-6"
              >
                <Edit2 size={16} />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={saveProfile}
                  className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 flex items-center gap-2"
                  disabled={isSaving}
                >
                  <Save size={16} />
                  {isSaving ? "Saving" : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={cancelEditing}
                  className="text-zinc-300 hover:text-white rounded-full px-4"
                >
                  <X size={16} />
                </Button>
              </>
            )}
          </div>
        </div>

        {statusMessage && (
          <div className="border border-zinc-800 bg-zinc-900/60 text-zinc-300 text-sm px-4 py-3 rounded-2xl">
            {statusMessage}
          </div>
        )}

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-12 mt-20">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Mail size={18} className="text-zinc-500" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <MapPin size={18} className="text-zinc-500" />
                  {isEditing ? (
                    <input
                      className="bg-transparent border-b border-zinc-700 focus:border-white outline-none"
                      value={formState?.location ?? ""}
                      onChange={(event) =>
                        setFormState((prev) => (prev ? { ...prev, location: event.target.value } : prev))
                      }
                      placeholder="City, Country"
                    />
                  ) : (
                    profile.location || "Location not set"
                  )}
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Clock size={18} className="text-zinc-500" />
                  {isEditing ? (
                    <input
                      className="bg-transparent border-b border-zinc-700 focus:border-white outline-none"
                      value={formState?.timezone ?? ""}
                      onChange={(event) =>
                        setFormState((prev) => (prev ? { ...prev, timezone: event.target.value } : prev))
                      }
                      placeholder="Timezone"
                    />
                  ) : (
                    profile.timezone || "Timezone not set"
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Social Synergy</h3>
              <div className="flex flex-wrap gap-2">
                {socials.map((label) => (
                  <Badge
                    key={label}
                    className="bg-zinc-800 text-zinc-300 border-zinc-700 py-1.5 px-4 rounded-full"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <Card className="bg-zinc-900 border-zinc-800 rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white text-xl">Biography</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-400 leading-relaxed text-lg">
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[140px] bg-transparent border border-zinc-700 rounded-2xl p-4 focus:border-white outline-none"
                    value={formState?.bio ?? ""}
                    onChange={(event) =>
                      setFormState((prev) => (prev ? { ...prev, bio: event.target.value } : prev))
                    }
                    placeholder="Write your story."
                  />
                ) : (
                  profile.bio ||
                  "Crafting digital experiences at the intersection of geometry and functionality. Focused on building scalable design systems and high-performance user interfaces."
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Projects Completed", value: profile.projects_completed ?? 0 },
                { label: "Community Rank", value: profile.rank ?? "Member" },
              ].map((stat) => (
                <Card key={stat.label} className="bg-zinc-900 border-zinc-800 rounded-2xl">
                  <CardContent className="pt-6">
                    <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative rounded-3xl overflow-hidden h-40 group cursor-pointer">
              <Image
                src={popArtImage}
                alt="Portfolio"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-125 hover:scale-100"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-xl tracking-widest uppercase">View Portfolio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
