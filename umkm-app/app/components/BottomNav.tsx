"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Beranda" },
  { href: "/search", icon: Search, label: "Cari" },
  { href: "/upload", icon: PlusSquare, label: "Upload", isUpload: true },
  { href: "/profile", icon: User, label: "Profil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-ig-border z-50">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/" && pathname === "/") ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            if (item.isUpload) {
              return (
                <Link key={item.href} href={item.href} className="p-2">
                  <div className="ig-gradient rounded-lg p-[2px]">
                    <div className="bg-white rounded-md p-[2px]">
                      <Icon size={26} strokeWidth={1.5} className="text-ig-text" />
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <Link key={item.href} href={item.href} className="p-2">
                <Icon
                  size={26}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  fill={isActive ? "currentColor" : "none"}
                  className={isActive ? "text-ig-text" : "text-ig-text-secondary"}
                />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-[72px] bg-white border-r border-ig-border z-50 flex-col items-center py-6 gap-2">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-10 h-10 ig-gradient rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">U</span>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/" && pathname === "/") ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            if (item.isUpload) {
              return (
                <Link key={item.href} href={item.href} className="p-2 group" title={item.label}>
                  <div className="ig-gradient rounded-xl p-[2px] group-hover:opacity-90 transition-opacity">
                    <div className="bg-white rounded-[10px] p-[2px]">
                      <Icon size={24} strokeWidth={1.5} className="text-ig-text" />
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-ig-text text-white"
                    : "text-ig-text-secondary hover:bg-gray-100"
                }`}
                title={item.label}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  fill={isActive ? "currentColor" : "none"}
                />
              </Link>
            );
          })}
        </div>

        {/* Bottom label */}
        <div className="text-[10px] text-ig-text-secondary font-medium">UMKM</div>
      </nav>
    </>
  );
}
