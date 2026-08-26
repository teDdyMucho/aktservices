"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardList,
  Handshake,
  House,
  LogIn,
  LogOut,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { GHL_URL } from "@/components/GhlAffiliate";

const links = [
  { label: "Overview", href: "/", value: "home", icon: House },
  { label: "About", href: "/about", value: "about", icon: UserRound },
  {
    label: "Services",
    href: "/services",
    value: "services",
    icon: BriefcaseBusiness,
  },
  { label: "Partners", href: "/partners", value: "partners", icon: Handshake },
  { label: "AI Tools", href: "/ai-tools", value: "ai-tools", icon: Bot },
  { label: "Marketing", href: "/marketing", value: "marketing", icon: Megaphone },
  { label: "Blog", href: "/blog", value: "blog", icon: Newspaper },
];

function activeValue(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/partners")) return "partners";
  if (pathname.startsWith("/dashboard")) return "ai-tools";
  if (pathname.startsWith("/ai-tools")) return "ai-tools";
  if (pathname.startsWith("/review")) return "review";
  if (pathname.startsWith("/marketing")) return "marketing";
  if (pathname.startsWith("/blog")) return "blog";
  return "";
}

/** Friendly title shown in the mobile header center (homepage shows the GHL image instead). */
function headerTitle(pathname: string): string | null {
  if (pathname === "/") return null;
  const match = links.find((link) => link.value === activeValue(pathname));
  if (match) return match.label;
  if (pathname.startsWith("/contact")) return "Contact";
  if (pathname.startsWith("/login")) return "Log in";
  if (pathname.startsWith("/admin")) return "Admin";
  return null;
}

export default function Nav() {
  const pathname = usePathname();
  const { user, ready, isAdmin, isStaff, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const current = activeValue(pathname);
  const title = headerTitle(pathname);

  // Regular users get the personalised dashboard; admin/staff stay on the public AI Tools page
  const navLinks = links.map((l) =>
    l.value === "ai-tools"
      ? { ...l, href: ready && user && !isAdmin && !isStaff ? "/dashboard" : "/ai-tools" }
      : l,
  );

  // Close the user dropdown when clicking outside it.
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [userMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current <= 10) {
        setVisible(true);
      } else if (current < lastScrollY.current - 4) {
        setVisible(true);
      } else if (current > lastScrollY.current + 8) {
        setVisible(false);
        setOpen(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0c]/90 shadow-[0_1px_0_0_rgba(255,255,255,0.02)] backdrop-blur-md"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-110%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <nav className="grid h-[72px] w-full grid-cols-[1fr_auto_1fr] items-center gap-4 pl-5 pr-4 sm:pl-8 sm:pr-6 lg:pl-12 lg:pr-10">
        <Link
          href="/"
          className="flex items-center gap-3 justify-self-start"
          aria-label="AKT homepage"
        >
          <Image
            src="/image/akt_logo.png"
            alt="AKT logo"
            width={421}
            height={377}
            priority
            className="h-10 w-auto sm:h-11"
          />
          <span className="hidden leading-none sm:block">
            <span className="block font-syne text-[15px] font-extrabold tracking-wide text-white">
              AKT
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
              Virtual Assistance Services
            </span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-self-center">
          <Tabs value={current} className="hidden lg:block">
          <TabsList className="h-auto items-stretch gap-2 rounded-none bg-transparent p-0 lg:gap-5">
            {[
              ...navLinks,
              ...(ready && (isStaff || isAdmin)
                ? [{ label: "Review", href: "/review", value: "review", icon: ClipboardList }]
                : []),
            ].map((link) => {
              const Icon = link.icon;

              return (
              <TabsTrigger
                key={link.value}
                value={link.value}
                asChild
                className="group relative flex-col px-4 py-2.5 text-xs font-medium text-white/45 transition duration-200 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent hover:text-white hover:[text-shadow:0_0_12px_rgba(255,255,255,0.55)] data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:after:bg-[#0ABFA3] lg:px-5"
              >
                <Link href={link.href} className="flex flex-col items-center">
                  <Icon
                    className="mb-1.5 opacity-70 transition duration-200 group-hover:opacity-100 group-hover:drop-shadow-[0_0_7px_rgba(255,255,255,0.65)]"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {link.label}
                </Link>
              </TabsTrigger>
              );
            })}
          </TabsList>
          </Tabs>

          {/* GoHighLevel affiliate image — homepage only, mobile/tablet, centered with a pulsing glow */}
          {pathname === "/" && (
            <a
              href={GHL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Try GoHighLevel now"
              className="ghl-pulse relative block shrink-0 overflow-hidden rounded-lg transition-transform active:scale-95 lg:hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/GHL.png"
                alt="GoHighLevel"
                className="block h-9 w-auto rounded-lg"
                style={{ filter: "brightness(0.78) hue-rotate(-30deg) saturate(1.4)" }}
              />
              <span className="pointer-events-none absolute inset-0 rounded-lg bg-[#0ABFA3]/20 mix-blend-color" />
            </a>
          )}

          {/* Current page title — non-homepage, mobile/tablet only */}
          {title && (
            <span className="truncate font-syne text-[15px] font-bold tracking-wide text-white lg:hidden">
              {title}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 justify-self-end">
          {ready && isAdmin && (
            <Link
              href="/admin"
              className="hidden items-center gap-1.5 rounded-md border border-[#0ABFA3]/40 px-3.5 py-2.5 text-sm font-semibold text-[#0ABFA3] transition-colors hover:bg-[#0ABFA3]/10 lg:inline-flex"
            >
              <ShieldCheck size={15} />
              Admin
            </Link>
          )}
          {ready &&
            (user ? (
              <div ref={userMenuRef} className="relative hidden lg:block">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  className="flex items-center gap-2 rounded-md border border-white/15 px-3.5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  <UserRound size={15} className="text-white/55" />
                  {user.name.split(" ")[0]}
                  <ChevronDown
                    size={14}
                    className={`text-white/50 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-white/10 bg-[#141416] shadow-xl shadow-black/40"
                  >
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                      <p className="truncate text-xs text-white/50">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <Settings size={15} />
                      Manage Account
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <LogOut size={15} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-md border border-white/15 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white lg:inline-flex"
              >
                Log in
              </Link>
            ))}
          <button
            className="rounded-md border border-white/15 p-2 text-white/70 transition-colors hover:text-white lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="animate-fade-in border-t border-white/10 bg-[#0c0c0e]/95 px-4 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-3 shadow-2xl shadow-black/60 backdrop-blur-md lg:hidden">
          <nav className="grid gap-1.5">
            {[
              ...navLinks,
              ...(ready && (isStaff || isAdmin)
                ? [{ label: "Review", href: "/review", value: "review", icon: ClipboardList }]
                : []),
            ].map((link) => {
              const Icon = link.icon;
              const active = current === link.value;
              return (
                <Link
                  key={link.value}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[15px] font-semibold transition-all ${
                    active
                      ? "border-[#0ABFA3]/40 bg-[#0ABFA3]/10 text-white"
                      : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      active
                        ? "bg-[#0ABFA3]/20 text-[#0ABFA3]"
                        : "bg-white/5 text-white/45 group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} aria-hidden="true" />
                  </span>
                  {link.label}
                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#0ABFA3] shadow-[0_0_8px_rgba(10,191,163,0.85)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="my-3 h-px bg-white/10" />

          <div className="grid gap-1.5">
            {ready && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-[15px] font-semibold text-[#0ABFA3] transition-colors hover:bg-[#0ABFA3]/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0ABFA3]/15 text-[#0ABFA3]">
                  <ShieldCheck size={18} strokeWidth={2} aria-hidden="true" />
                </span>
                Admin
              </Link>
            )}
            {ready &&
              (user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-[15px] font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/45">
                      <Settings size={18} strokeWidth={2} aria-hidden="true" />
                    </span>
                    Manage Account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-[15px] font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/45">
                      <LogOut size={18} strokeWidth={2} aria-hidden="true" />
                    </span>
                    Log out
                    <span className="ml-auto truncate text-xs font-medium text-white/35">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-[15px] font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/45">
                    <LogIn size={18} strokeWidth={2} aria-hidden="true" />
                  </span>
                  Log in
                </Link>
              ))}
          </div>

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0ABFA3] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0abfa3]/20 transition-colors hover:bg-[#089080]"
          >
            Book a Consultation
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </header>
  );
}
