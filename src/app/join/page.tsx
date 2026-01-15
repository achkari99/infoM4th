"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  major: z.string().min(2, "Major is required"),
  message: z.string().min(10, "Tell us why you're interested"),
});

type FormValues = z.infer<typeof formSchema>;

type StatusState = {
  type: "success" | "error" | "info";
  message: string;
} | null;

export default function Join() {
  const [status, setStatus] = useState<StatusState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      major: "",
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setStatus({
      type: "info",
      message: "Submitting your note to the team?",
    });
    setIsSubmitting(true);

    const { error } = await supabase.from("join_requests").insert({
      name: values.name,
      email: values.email,
      major: values.major,
      message: values.message,
      status: "new",
    });

    if (error) {
      setStatus({
        type: "error",
        message: error.message,
      });
      setIsSubmitting(false);
      return;
    }

    setStatus({
      type: "success",
      message: "Request received. We'll reply with next steps soon.",
    });
    setIsSubmitting(false);
    form.reset();
  }

  const benefits = [
    "Access to exclusive learning library",
    "Workshops & hands-on coding sessions",
    "Networking with passionate peers",
    "Project collaboration opportunities",
    "Career guidance & mentorship",
  ];

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[10vw] font-display font-black uppercase leading-none mb-16 text-center"
        >
          Join<br />InfoM4th
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Left Side - Why Join */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-display font-bold uppercase mb-8">Why Join?</h2>

            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 pt-1">
                    <CheckCircle2 size={28} className="text-primary font-bold" />
                  </div>
                  <p className="text-xl font-medium">{benefit}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 bg-secondary border-4 border-black p-8 neo-shadow-lg"
            >
              <p className="text-lg font-bold leading-relaxed">
                No experience necessary. Beginners, intermediates, and advanced students all have a place here. We believe
                in learning together.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          className="bg-card border-4 border-border p-8 md:p-12 neo-shadow-lg h-fit"
          >
            <h3 className="text-3xl font-display font-bold uppercase mb-8">Quick Signup</h3>

            {status && (
              <div
                className={`mb-6 border-2 px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] ${
                  status.type === "success"
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-700"
                    : status.type === "error"
                      ? "border-zinc-400 bg-zinc-100 text-zinc-700"
                      : "border-black/30 bg-black/5 text-black/70"
                }`}
                aria-live="polite"
              >
                {status.message}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold uppercase">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          className="border-2 border-black h-12 text-base focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/60 rounded-none bg-gray-50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold uppercase">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          {...field}
                          className="border-2 border-black h-12 text-base focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/60 rounded-none bg-gray-50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold uppercase">Major / Focus</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., CS, Math, Engineering"
                          {...field}
                          className="border-2 border-black h-12 text-base focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/60 rounded-none bg-gray-50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold uppercase">Why InfoM4th?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us what interests you..."
                          {...field}
                          className="border-2 border-black min-h-[100px] text-base focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/60 rounded-none bg-gray-50 resize-none transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-14 text-xl font-bold uppercase bg-primary text-white hover:bg-foreground hover:text-white border-2 border-transparent hover:border-primary transition-all neo-shadow hover:neo-shadow-active rounded-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting?" : "Join the Community"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-foreground text-background p-12 md:p-16 border-4 border-black neo-shadow-lg text-center"
        >
          <h2 className="text-5xl md:text-6xl font-display font-black uppercase mb-6 leading-tight">
            Let's Build Together
          </h2>
          <p className="text-xl md:text-2xl">
            Every semester, we welcome new members and grow stronger. You're joining not just a club, but a community of
            thinkers and builders.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
