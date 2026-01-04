'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Bell, 
  Search,
  Plus
} from "lucide-react";
import Image from "next/image";
import popArtImage from "@/../attached_assets/ChatGPT_Image_Dec_31,_2025,_07_39_12_PM_1767368748048.png";

export default function AdminPage() {
  const stats = [
    { label: "Total Users", value: "1,284", change: "+12%" },
    { label: "Active Now", value: "42", change: "+5%" },
    { label: "Revenue", value: "$42,000", change: "+18%" },
    { label: "System Health", value: "99.9%", change: "Stable" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col gap-8 hidden md:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded bg-white" />
          <span className="font-bold text-xl tracking-tight">INFOM4TH</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Users, label: "Users" },
            { icon: BarChart3, label: "Analytics" },
            { icon: Bell, label: "Notifications" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-zinc-800 px-8 flex items-center justify-between sticky top-0 bg-black/50 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800 w-96">
            <Search size={18} className="text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search everything..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900 text-white rounded-full px-6">
              Invite User
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-zinc-800 overflow-hidden">
               <Image src={popArtImage} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Console</h1>
              <p className="text-zinc-500 mt-1">Manage your platform ecosystem.</p>
            </div>
            <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 flex items-center gap-2">
              <Plus size={18} />
              New Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <span className="text-zinc-500 text-sm font-medium">{stat.label}</span>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    <span className="text-emerald-500 text-sm font-bold">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 min-h-[400px]">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <Users className="text-zinc-400" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-white">New User Registered</p>
                          <p className="text-sm text-zinc-500">2 minutes ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-zinc-500 hover:text-white">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
               <div className="rounded-2xl overflow-hidden relative group aspect-square">
                  <Image 
                    src={popArtImage} 
                    alt="System Status" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-white">System Pulse</h3>
                    <p className="text-zinc-400 text-sm">All regions operational.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
