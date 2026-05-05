"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";

export function SidebarNav({ items }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderNavItem = (item, isChild = false) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    if (item.children) {
      const isOpen = openMenus[item.title] || false;
      return (
        <div key={item.title}>
          <Button
            variant="ghost"
            onClick={() => toggleMenu(item.title)}
            className={cn(
              "w-full justify-start h-12 px-4 transition-all duration-200 group relative overflow-hidden",
              isOpen
                ? "bg-gradient-to-r from-neon-coral/10 to-aqua-blue/10 text-deep-navy border border-neon-coral/20 shadow-lg"
                : "hover:bg-gradient-to-r hover:from-neon-coral/5 hover:to-aqua-blue/5 text-text-gray hover:text-deep-navy"
            )}
          >
            {isOpen && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-coral to-aqua-blue rounded-r-full" />
            )}
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200",
                isOpen
                  ? "bg-gradient-to-r from-neon-coral to-aqua-blue text-white shadow-lg"
                  : "bg-deep-navy/5 text-deep-navy/60 group-hover:bg-gradient-to-r group-hover:from-neon-coral/20 group-hover:to-aqua-blue/20 group-hover:text-deep-navy"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            {/* <span className="flex-1 text-left font-medium">{item.title}</span> */}
            <span className="flex-1 text-left font-medium break-words whitespace-normal leading-snug">
              {item.title}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen ? "rotate-180 text-neon-coral" : "text-text-gray"
              )}
            />
          </Button>
          {isOpen && (
            <div className="ml-2 mt-1 space-y-1 border-l border-gray-200 pl-2">
              {item.children.map((child) => renderNavItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link key={item.href} href={item.href}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-12 px-4 transition-all duration-200 group relative overflow-hidden",
            isActive
              ? "bg-gradient-to-r from-neon-coral/10 to-aqua-blue/10 text-deep-navy border border-neon-coral/20 shadow-lg"
              : "hover:bg-gradient-to-r hover:from-neon-coral/5 hover:to-aqua-blue/5 text-text-gray hover:text-deep-navy",
            isChild && "h-10 pl-6"
          )}
        >
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-coral to-aqua-blue rounded-r-full" />
          )}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-neon-coral to-aqua-blue text-white shadow-lg"
                : "bg-deep-navy/5 text-deep-navy/60 group-hover:bg-gradient-to-r group-hover:from-neon-coral/20 group-hover:to-aqua-blue/20 group-hover:text-deep-navy"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span className="flex-1 text-left font-medium">{item.title}</span>
          {item.badge && (
            <Badge className="ml-2 bg-electric-orange text-white text-xs animate-ai-pulse">
              {item.badge}
            </Badge>
          )}
          {isActive && !isChild && (
            <ChevronRight className="h-4 w-4 text-neon-coral" />
          )}
        </Button>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full w-[280px] bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {items.map((item) => renderNavItem(item))}
        </nav>
      </div>
    </div>
  );
}
