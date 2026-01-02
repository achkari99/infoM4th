"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Events", href: "/events" },
        { label: "Library", href: "/library" },
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Team", href: "/team" },
        { label: "Join Us", href: "/join" },
        { label: "Code of Conduct", href: "/" },
        { label: "Contact", href: "/" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/" },
        { label: "Tutorials", href: "/library" },
        { label: "Project Archive", href: "/" },
        { label: "Blog", href: "/" },
      ]
    }
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Mail, label: "Email", href: "mailto:hello@infom4th.com" },
  ];

  return (
    <footer className="bg-foreground text-background border-t-4 border-white/20">
      {/* Main Footer Content */}
      <div className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <Link href="/" className="text-3xl font-display font-black uppercase mb-4 block cursor-pointer hover:text-primary transition-colors">
              INFO<span className="text-primary">M4TH</span>
            </Link>
            <p className="text-lg opacity-80 mb-6 leading-relaxed">
              Where Computer Science and Mathematics converge. Building ambitious students and their dreams.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a 
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white/30 hover:border-primary hover:bg-primary hover:text-foreground flex items-center justify-center transition-all duration-300"
                  title={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link Sections */}
          {footerLinks.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-xl font-display font-bold uppercase mb-6 border-b-2 border-primary pb-3">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="opacity-70 hover:opacity-100 hover:text-primary transition-all cursor-pointer flex items-center gap-2 group">
                      <span>{link.label}</span>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-white/20 pt-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { number: "150+", label: "Members" },
                { number: "6+", label: "Learning Paths" },
                { number: "20+", label: "Events/Year" },
              ].map((stat, i) => (
                <div key={i} className="border border-white/20 p-4 hover:border-primary transition-colors">
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm opacity-60 uppercase font-mono">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-primary text-foreground p-6 border-2 border-primary hover:bg-transparent hover:text-primary transition-all cursor-pointer"
            >
              <h4 className="font-display font-bold uppercase mb-2">Stay Updated</h4>
              <p className="text-sm opacity-90">Get event announcements and learning updates in your inbox.</p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm opacity-60"
        >
          <div>
            © {currentYear} InfoM4th Club. All rights reserved. Built with <span className="text-primary font-bold">creativity</span> and <span className="text-accent font-bold">code</span>.
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:opacity-100 transition-opacity cursor-pointer">Privacy Policy</Link>
            <Link href="/" className="hover:opacity-100 transition-opacity cursor-pointer">Terms of Service</Link>
            <Link href="/" className="hover:opacity-100 transition-opacity cursor-pointer">Accessibility</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
