'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import popArtImage from "@/../attached_assets/ChatGPT_Image_Dec_31,_2025,_07_39_12_PM_1767368748048.png";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-zinc-950">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Create Account</CardTitle>
            <CardDescription className="text-zinc-400">
              Join the elite community of designers and thinkers
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
              <Input id="name" placeholder="John Doe" className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input id="password" type="password" className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <Button className="w-full bg-white text-black hover:bg-zinc-200">
              Create Account
            </Button>
            <div className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:block relative overflow-hidden bg-zinc-900">
        <Image
          src={popArtImage}
          alt="Pop Art Abstract"
          fill
          className="object-cover opacity-80 mix-blend-overlay hover:mix-blend-normal transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Start your journey today.</h2>
            <p className="text-zinc-400 max-w-md">The most beautiful interfaces start with a single click.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
