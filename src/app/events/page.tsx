"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface EventRecord {
  id: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  category: "Workshop" | "Hackathon" | "Talk" | "Social";
  description: string;
  attendees: number | null;
  status: "upcoming" | "past";
  registration_url: string | null;
}

const categoryColors = {
  Workshop: "bg-blue-100 text-blue-900 border-blue-400",
  Hackathon: "bg-purple-100 text-purple-900 border-purple-400",
  Talk: "bg-green-100 text-green-900 border-green-400",
  Social: "bg-pink-100 text-pink-900 border-pink-400",
};

const categoryIconColors = {
  Workshop: "text-blue-600",
  Hackathon: "text-purple-600",
  Talk: "text-green-600",
  Social: "text-pink-600",
};

export default function Events() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .is("archived_at", null)
        .order("date", { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      setEvents((data as EventRecord[]) ?? []);
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  const upcomingEvents = useMemo(
    () => events.filter((event) => event.status === "upcoming"),
    [events],
  );
  const pastEvents = useMemo(() => events.filter((event) => event.status === "past"), [events]);

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-[10vw] font-display font-black uppercase leading-none mb-6">Events</h1>
          <p className="text-2xl max-w-3xl font-medium">
            Workshops, talks, hackathons, and community hangouts. No matter your level, there's something here for you.
          </p>
        </motion.div>

        {error && (
          <div className="border-4 border-black bg-white p-6 neo-shadow mb-10 text-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="border-4 border-black bg-white p-8 neo-shadow animate-pulse">Loading events?</div>
        ) : (
          <>
            {/* Upcoming Events */}
            <section className="mb-32">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-7xl font-display font-black uppercase mb-12 border-b-4 border-black pb-4"
              >
                Upcoming
              </motion.h2>

              {upcomingEvents.length === 0 ? (
                <div className="border-4 border-black bg-white p-8 neo-shadow">
                  No upcoming events yet. Check back soon.
                </div>
              ) : (
                <div className="space-y-6">
                  {upcomingEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="border-4 border-black bg-white p-8 neo-shadow hover:neo-shadow-hover group cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 h-full w-1 bg-primary" />

                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Left: Title & Category */}
                        <div className="md:col-span-2">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-3xl md:text-4xl font-display font-bold uppercase leading-tight group-hover:text-primary transition-colors flex-1">
                              {event.title}
                            </h3>
                            <span
                              className={`px-4 py-2 rounded border-2 whitespace-nowrap font-bold text-sm uppercase ${
                                categoryColors[event.category] ?? "bg-gray-100 text-gray-900 border-gray-400"
                              }`}
                            >
                              {event.category}
                            </span>
                          </div>
                          <p className="text-lg opacity-80 mb-6 leading-relaxed">{event.description}</p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Users size={16} className={categoryIconColors[event.category] ?? "text-gray-600"} />
                              <span className="font-bold">{event.attendees ?? 0} attending</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Date, Time, Location */}
                        <div className="bg-gray-50 border-2 border-black p-6 space-y-4">
                          <div>
                            <div className="text-xs font-mono uppercase opacity-60 mb-1">Date</div>
                            <div className="flex items-center gap-2 text-lg font-bold">
                              <Calendar size={20} />
                              {event.date}
                            </div>
                          </div>
                          <div className="border-t-2 border-black pt-4">
                            <div className="text-xs font-mono uppercase opacity-60 mb-1">Time</div>
                            <div className="text-lg font-bold">{event.time || "TBA"}</div>
                          </div>
                          <div className="border-t-2 border-black pt-4">
                            <div className="text-xs font-mono uppercase opacity-60 mb-1">Location</div>
                            <div className="flex items-start gap-2">
                              <MapPin size={20} className="flex-shrink-0 mt-1" />
                              <span className="text-lg font-bold">{event.location || "Location TBD"}</span>
                            </div>
                          </div>
                          <div className="pt-4 border-t-2 border-black flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer opacity-70 group-hover:opacity-100">
                            <span className="font-bold">{event.registration_url ? "Register" : "Details"}</span>
                            <ChevronRight size={20} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section className="mb-20">
                <h2 className="text-6xl md:text-7xl font-display font-black uppercase mb-12 border-b-4 border-black pb-4 opacity-60">
                  Past Events
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {pastEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="border-2 border-gray-400 bg-gray-50 p-6 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <h3 className="text-2xl font-display font-bold uppercase mb-3">{event.title}</h3>
                      <p className="text-sm font-mono opacity-60 mb-2">{event.date}</p>
                      <p className="text-sm">{event.description}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-accent text-white p-12 md:p-16 border-4 border-black neo-shadow-lg text-center"
        >
          <h2 className="text-5xl md:text-6xl font-display font-black uppercase mb-6">Don't Miss Out</h2>
          <p className="text-xl md:text-2xl mb-8">
            Join our mailing list to get notified about new events as soon as they're announced.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
