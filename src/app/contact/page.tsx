"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Tell us more"),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Message Sent!",
      description: "We'll get back to you when we're done partying.",
    });
    console.log(values);
  }

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20 flex flex-col items-center">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-7xl md:text-8xl font-display font-black uppercase mb-8 text-center text-stroke">
          Get In Touch
        </h1>
        
        <div className="bg-card border-4 border-border p-8 md:p-12 neo-shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold uppercase">Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="WHO ARE YOU?" 
                        {...field} 
                        className="border-2 border-black h-14 text-lg font-medium focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:ring-primary rounded-none bg-gray-50" 
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
                    <FormLabel className="text-xl font-bold uppercase">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="WHERE CAN WE REACH YOU?" 
                        {...field} 
                        className="border-2 border-black h-14 text-lg font-medium focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:ring-primary rounded-none bg-gray-50" 
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
                    <FormLabel className="text-xl font-bold uppercase">Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="TELL US YOUR WILDEST DREAMS..." 
                        {...field} 
                        className="border-2 border-black min-h-[150px] text-lg font-medium focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:ring-primary rounded-none bg-gray-50 resize-none" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-16 text-2xl font-bold uppercase bg-black text-white hover:bg-primary hover:text-white border-2 border-transparent hover:border-black transition-all neo-shadow hover:neo-shadow-active rounded-none"
              >
                Send It
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
