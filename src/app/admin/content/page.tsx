"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

interface NewsDraft {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  tag: string;
  date: string;
  read_time: string;
  body: string;
  is_featured: boolean;
  archived_at?: string | null;
}

interface EventDraft {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  status: "upcoming" | "past";
  registration_url: string;
  archived_at?: string | null;
}

interface LibraryDraft {
  id?: string;
  title: string;
  category: string;
  description: string;
  modules: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructors: number;
  rating: number;
  students: number;
  archived_at?: string | null;
}

const emptyNewsDraft: NewsDraft = {
  slug: "",
  title: "",
  summary: "",
  category: "",
  tag: "",
  date: "",
  read_time: "",
  body: "",
  is_featured: false,
};

const emptyEventDraft: EventDraft = {
  title: "",
  date: "",
  time: "",
  location: "",
  category: "Workshop",
  description: "",
  status: "upcoming",
  registration_url: "",
};

const emptyLibraryDraft: LibraryDraft = {
  title: "",
  category: "",
  description: "",
  modules: 0,
  difficulty: "Beginner",
  instructors: 0,
  rating: 0,
  students: 0,
};

export default function AdminContentPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [newsItems, setNewsItems] = useState<NewsDraft[]>([]);
  const [events, setEvents] = useState<EventDraft[]>([]);
  const [libraryPaths, setLibraryPaths] = useState<LibraryDraft[]>([]);

  const [newsDraft, setNewsDraft] = useState<NewsDraft>(emptyNewsDraft);
  const [eventDraft, setEventDraft] = useState<EventDraft>(emptyEventDraft);
  const [libraryDraft, setLibraryDraft] = useState<LibraryDraft>(emptyLibraryDraft);

  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingLibraryId, setEditingLibraryId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace("/login");
    }
  }, [sessionLoading, user, router]);

  useEffect(() => {
    const loadContent = async () => {
      if (!user) return;
      setIsLoading(true);
      setStatusMessage(null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(true);

      const [{ data: newsData }, { data: eventsData }, { data: libraryData }] = await Promise.all([
        supabase
          .from("news")
          .select("id, slug, title, summary, category, tag, date, read_time, is_featured, sections, archived_at")
          .order("date", { ascending: false }),
        supabase.from("events").select("*").order("date", { ascending: false }),
        supabase.from("library_paths").select("*").order("title", { ascending: true }),
      ]);

      const newsMapped = (newsData ?? []).map((item: any) => ({
        ...item,
        body: item.sections?.[0]?.body ?? "",
      }));

      setNewsItems(newsMapped as NewsDraft[]);
      setEvents((eventsData as EventDraft[]) ?? []);
      setLibraryPaths((libraryData as LibraryDraft[]) ?? []);
      setIsLoading(false);
    };

    loadContent();
  }, [user]);

  const logAudit = async (action: string, target: string, detail: string) => {
    if (!user) return;
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action,
      target_type: target,
      target_id: null,
      detail,
    });
  };

  const saveNews = async () => {
    if (!newsDraft.slug || !newsDraft.title) {
      setStatusMessage("News requires a slug and title.");
      return;
    }

    const payload = {
      slug: newsDraft.slug,
      title: newsDraft.title,
      summary: newsDraft.summary,
      category: newsDraft.category,
      tag: newsDraft.tag,
      date: newsDraft.date,
      read_time: newsDraft.read_time,
      sections: newsDraft.body ? [{ heading: "Entry", body: newsDraft.body }] : [],
      is_featured: newsDraft.is_featured,
    };

    if (editingNewsId) {
      const { data, error } = await supabase
        .from("news")
        .update(payload)
        .eq("id", editingNewsId)
        .select()
        .single();

      if (error) {
        setStatusMessage(error.message);
        return;
      }

      setNewsItems((prev) => prev.map((item) => (item.id === editingNewsId ? { ...item, ...data, body: newsDraft.body } : item)));
      setEditingNewsId(null);
      setNewsDraft(emptyNewsDraft);
      await logAudit("news_update", "news", `Updated ${data.title}`);

      if (newsDraft.is_featured) {
        await supabase.from("news").update({ is_featured: false }).neq("id", data.id);
      }
      return;
    }

    const { data, error } = await supabase.from("news").insert(payload).select().single();

    if (error) {
      setStatusMessage(error.message);
      return;
    }

    setNewsItems((prev) => [{ ...(data as NewsDraft), body: newsDraft.body }, ...prev]);
    setNewsDraft(emptyNewsDraft);
    await logAudit("news_create", "news", `Created ${data.title}`);

    if (newsDraft.is_featured) {
      await supabase.from("news").update({ is_featured: false }).neq("id", data.id);
    }
  };

  const saveEvent = async () => {
    if (!eventDraft.title || !eventDraft.date) {
      setStatusMessage("Event requires a title and date.");
      return;
    }

    if (editingEventId) {
      const { data, error } = await supabase
        .from("events")
        .update(eventDraft)
        .eq("id", editingEventId)
        .select()
        .single();

      if (error) {
        setStatusMessage(error.message);
        return;
      }

      setEvents((prev) => prev.map((item) => (item.id === editingEventId ? (data as EventDraft) : item)));
      setEditingEventId(null);
      setEventDraft(emptyEventDraft);
      await logAudit("event_update", "events", `Updated ${data.title}`);
      return;
    }

    const { data, error } = await supabase.from("events").insert(eventDraft).select().single();

    if (error) {
      setStatusMessage(error.message);
      return;
    }

    setEvents((prev) => [data as EventDraft, ...prev]);
    setEventDraft(emptyEventDraft);
    await logAudit("event_create", "events", `Created ${data.title}`);
  };

  const saveLibrary = async () => {
    if (!libraryDraft.title || !libraryDraft.category) {
      setStatusMessage("Library entry requires title and category.");
      return;
    }

    if (editingLibraryId) {
      const { data, error } = await supabase
        .from("library_paths")
        .update(libraryDraft)
        .eq("id", editingLibraryId)
        .select()
        .single();

      if (error) {
        setStatusMessage(error.message);
        return;
      }

      setLibraryPaths((prev) => prev.map((item) => (item.id === editingLibraryId ? (data as LibraryDraft) : item)));
      setEditingLibraryId(null);
      setLibraryDraft(emptyLibraryDraft);
      await logAudit("library_update", "library_paths", `Updated ${data.title}`);
      return;
    }

    const { data, error } = await supabase.from("library_paths").insert(libraryDraft).select().single();

    if (error) {
      setStatusMessage(error.message);
      return;
    }

    setLibraryPaths((prev) => [data as LibraryDraft, ...prev]);
    setLibraryDraft(emptyLibraryDraft);
    await logAudit("library_create", "library_paths", `Created ${data.title}`);
  };

  const toggleArchive = async (table: string, id?: string, label?: string, archivedAt?: string | null) => {
    if (!id) return;
    const payload = { archived_at: archivedAt ? null : new Date().toISOString() };

    const { error } = await supabase.from(table).update(payload).eq("id", id);
    if (error) {
      setStatusMessage(error.message);
      return;
    }

    if (table === "news") {
      setNewsItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, archived_at: payload.archived_at } : item)),
      );
    }
    if (table === "events") {
      setEvents((prev) =>
        prev.map((item) => (item.id === id ? { ...item, archived_at: payload.archived_at } : item)),
      );
    }
    if (table === "library_paths") {
      setLibraryPaths((prev) =>
        prev.map((item) => (item.id === id ? { ...item, archived_at: payload.archived_at } : item)),
      );
    }

    await logAudit(
      payload.archived_at ? "content_archive" : "content_restore",
      table,
      `${payload.archived_at ? 'Archived' : 'Restored'} ${label ?? id}`,
    );
  };

  const latestNews = useMemo(() => newsItems.slice(0, 4), [newsItems]);
  const latestEvents = useMemo(() => events.slice(0, 4), [events]);
  const latestLibrary = useMemo(() => libraryPaths.slice(0, 4), [libraryPaths]);

  if (sessionLoading || isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-muted-foreground uppercase tracking-[0.3em] text-xs">Loading content</div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Access restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">Admin access is required to manage content.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <span className="h-1 w-10 bg-primary/70" />
        Content Suite
      </div>
      <div>
        <h1 className="text-3xl font-bold">Content</h1>
        <p className="text-muted-foreground">Create, curate, and ship new drops.</p>
      </div>

      {statusMessage && (
        <div className="border border-border bg-card/60 text-muted-foreground text-sm px-4 py-3 rounded-2xl">
          {statusMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">News Composer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Slug"
              value={newsDraft.slug}
              onChange={(event) => setNewsDraft({ ...newsDraft, slug: event.target.value })}
              className="bg-background border-border text-foreground"
            />
            <Input
              placeholder="Title"
              value={newsDraft.title}
              onChange={(event) => setNewsDraft({ ...newsDraft, title: event.target.value })}
              className="bg-background border-border text-foreground"
            />
            <Textarea
              placeholder="Summary"
              value={newsDraft.summary}
              onChange={(event) => setNewsDraft({ ...newsDraft, summary: event.target.value })}
              className="bg-background border-border text-foreground"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Category"
                value={newsDraft.category}
                onChange={(event) => setNewsDraft({ ...newsDraft, category: event.target.value })}
                className="bg-background border-border text-foreground"
              />
              <Input
                placeholder="Tag"
                value={newsDraft.tag}
                onChange={(event) => setNewsDraft({ ...newsDraft, tag: event.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Date (Jan 20, 2026)"
                value={newsDraft.date}
                onChange={(event) => setNewsDraft({ ...newsDraft, date: event.target.value })}
                className="bg-background border-border text-foreground"
              />
              <Input
                placeholder="Read time"
                value={newsDraft.read_time}
                onChange={(event) => setNewsDraft({ ...newsDraft, read_time: event.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <Textarea
              placeholder="Body text"
              value={newsDraft.body}
              onChange={(event) => setNewsDraft({ ...newsDraft, body: event.target.value })}
              className="bg-background border-border text-foreground min-h-[140px]"
            />
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={newsDraft.is_featured}
                  onChange={(event) => setNewsDraft({ ...newsDraft, is_featured: event.target.checked })}
                  className="mr-2 accent-primary"
                />
                Featured
              </label>
              <div className="flex items-center gap-3">
                {editingNewsId && (
                  <Button
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={() => {
                      setEditingNewsId(null);
                      setNewsDraft(emptyNewsDraft);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button className="bg-white text-black hover:bg-zinc-200" onClick={saveNews}>
                  {editingNewsId ? "Update" : "Publish"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent News</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestNews.length === 0 ? (
              <div className="text-muted-foreground">No news published.</div>
            ) : (
              latestNews.map((item) => (
                <div key={item.id} className="border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.archived_at ? "archived" : "live"}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <button
                      className="hover:text-foreground"
                      onClick={() => {
                        setEditingNewsId(item.id ?? null);
                        setNewsDraft({ ...item, body: item.body ?? "" });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="hover:text-foreground"
                      onClick={() => toggleArchive("news", item.id, item.title, item.archived_at)}
                    >
                      {item.archived_at ? "Restore" : "Archive"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Event Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={eventDraft.title}
              onChange={(event) => setEventDraft({ ...eventDraft, title: event.target.value })}
              className="bg-background border-border text-foreground"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Date"
                value={eventDraft.date}
                onChange={(event) => setEventDraft({ ...eventDraft, date: event.target.value })}
                className="bg-background border-border text-foreground"
              />
              <Input
                placeholder="Time"
                value={eventDraft.time}
                onChange={(event) => setEventDraft({ ...eventDraft, time: event.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Location"
                value={eventDraft.location}
                onChange={(event) => setEventDraft({ ...eventDraft, location: event.target.value })}
                className="bg-background border-border text-foreground"
              />
              <Input
                placeholder="Category"
                value={eventDraft.category}
                onChange={(event) => setEventDraft({ ...eventDraft, category: event.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <Textarea
              placeholder="Description"
              value={eventDraft.description}
              onChange={(event) => setEventDraft({ ...eventDraft, description: event.target.value })}
              className="bg-background border-border text-foreground min-h-[120px]"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Status (upcoming/past)"
                value={eventDraft.status}
                onChange={(event) =>
                  setEventDraft({
                    ...eventDraft,
                    status: event.target.value === "past" ? "past" : "upcoming",
                  })
                }
                className="bg-background border-border text-foreground"
              />
              <Input
                placeholder="Registration URL"
                value={eventDraft.registration_url}
                onChange={(event) => setEventDraft({ ...eventDraft, registration_url: event.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="flex items-center gap-3">
              {editingEventId && (
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => {
                    setEditingEventId(null);
                    setEventDraft(emptyEventDraft);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button className="bg-white text-black hover:bg-zinc-200" onClick={saveEvent}>
                {editingEventId ? "Update" : "Publish Event"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming + Recent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestEvents.length === 0 ? (
              <div className="text-muted-foreground">No events yet.</div>
            ) : (
              latestEvents.map((item) => (
                <div key={item.id} className="border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.archived_at ? "archived" : item.status}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <button
                      className="hover:text-foreground"
                      onClick={() => {
                        setEditingEventId(item.id ?? null);
                        setEventDraft(item);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="hover:text-foreground"
                      onClick={() => toggleArchive("events", item.id, item.title, item.archived_at)}
                    >
                      {item.archived_at ? "Restore" : "Archive"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Library Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={libraryDraft.title}
              onChange={(event) => setLibraryDraft({ ...libraryDraft, title: event.target.value })}
              className="bg-background border-border text-foreground"
            />
            <Input
              placeholder="Category"
              value={libraryDraft.category}
              onChange={(event) => setLibraryDraft({ ...libraryDraft, category: event.target.value })}
              className="bg-background border-border text-foreground"
            />
            <Textarea
              placeholder="Description"
              value={libraryDraft.description}
              onChange={(event) => setLibraryDraft({ ...libraryDraft, description: event.target.value })}
              className="bg-background border-border text-foreground min-h-[120px]"
            />
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                placeholder="Modules"
                type="number"
                value={libraryDraft.modules}
                onChange={(event) => setLibraryDraft({ ...libraryDraft, modules: Number(event.target.value) })}
                className="bg-background border-border text-foreground"
              />
              <Input
                placeholder="Difficulty"
                value={libraryDraft.difficulty}
                onChange={(event) =>
                  setLibraryDraft({
                    ...libraryDraft,
                    difficulty: event.target.value === "Advanced"
                      ? "Advanced"
                      : event.target.value === "Intermediate"
                        ? "Intermediate"
                        : "Beginner",
                  })
                }
                className="bg-background border-border text-foreground"
              />
              <Input
                placeholder="Instructors"
                type="number"
                value={libraryDraft.instructors}
                onChange={(event) => setLibraryDraft({ ...libraryDraft, instructors: Number(event.target.value) })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Rating"
                type="number"
                step="0.1"
                value={libraryDraft.rating}
                onChange={(event) => setLibraryDraft({ ...libraryDraft, rating: Number(event.target.value) })}
                className="bg-background border-border text-foreground"
              />
              <Input
                placeholder="Students"
                type="number"
                value={libraryDraft.students}
                onChange={(event) => setLibraryDraft({ ...libraryDraft, students: Number(event.target.value) })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="flex items-center gap-3">
              {editingLibraryId && (
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => {
                    setEditingLibraryId(null);
                    setLibraryDraft(emptyLibraryDraft);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button className="bg-white text-black hover:bg-zinc-200" onClick={saveLibrary}>
                {editingLibraryId ? "Update" : "Publish Library Entry"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Latest Paths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestLibrary.length === 0 ? (
              <div className="text-muted-foreground">No library paths yet.</div>
            ) : (
              latestLibrary.map((item) => (
                <div key={item.id} className="border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.archived_at ? "archived" : item.difficulty}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <button
                      className="hover:text-foreground"
                      onClick={() => {
                        setEditingLibraryId(item.id ?? null);
                        setLibraryDraft(item);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="hover:text-foreground"
                      onClick={() => toggleArchive("library_paths", item.id, item.title, item.archived_at)}
                    >
                      {item.archived_at ? "Restore" : "Archive"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
