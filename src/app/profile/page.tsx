'use client';

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
  Edit2
} from "lucide-react";
import Image from "next/image";
import popArtImage from "@/../attached_assets/ChatGPT_Image_Dec_31,_2025,_07_39_12_PM_1767368748048.png";

export default function ProfilePage() {
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
                <Image src={popArtImage} alt="Avatar" fill className="object-cover" />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white text-black rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera size={20} />
              </button>
            </div>
            <div className="pb-4 space-y-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                Alex Sterling
                <ShieldCheck className="text-blue-500" size={24} />
              </h1>
              <p className="text-zinc-400 font-medium">Product Designer & Strategist</p>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 md:top-auto md:bottom-4 md:right-8">
            <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-zinc-700 flex items-center gap-2 rounded-full px-6">
              <Edit2 size={16} />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-12 mt-20">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Mail size={18} className="text-zinc-500" />
                  alex.s@infom4th.com
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <MapPin size={18} className="text-zinc-500" />
                  San Francisco, CA
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Clock size={18} className="text-zinc-500" />
                  GMT-7 (10:42 AM)
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Social Synergy</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 py-1.5 px-4 rounded-full">Twitter</Badge>
                <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 py-1.5 px-4 rounded-full">LinkedIn</Badge>
                <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 py-1.5 px-4 rounded-full">GitHub</Badge>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <Card className="bg-zinc-900 border-zinc-800 rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white text-xl">Biography</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-400 leading-relaxed text-lg">
                Crafting digital experiences at the intersection of geometry and functionality. 
                Focused on building scalable design systems and high-performance user interfaces. 
                Obsessed with typography, whitespace, and pop-art aesthetics.
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: "Projects Completed", value: "42" },
                 { label: "Community Rank", value: "Elite" },
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
