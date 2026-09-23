"use client";

import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings, Check } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { markAllRead } from "@/lib/redux/slices/notifications-slice";
import { logout } from "@/lib/redux/slices/auth-slice";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const currentAdmin = useAppSelector((state) => state.auth.currentAdmin);
  const notifications = useAppSelector((state) => state.notifications.items);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const dispatch = useAppDispatch();
  const router = useRouter();

  function handleSignOut() {
    dispatch(logout());
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search listings, users, transactions..."
          className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-14 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:bg-white"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger-600" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="px-0 py-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => dispatch(markAllRead())}
                  className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2">
                <span className="flex w-full items-center gap-1.5 font-medium text-slate-900">
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />}
                  {n.title}
                </span>
                <span className="text-xs text-slate-500">{n.description}</span>
                <span className="text-xs text-slate-400">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-slate-100">
              <Avatar name={currentAdmin.name} size="sm" />
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-tight text-slate-900">
                  {currentAdmin.name}
                </p>
                <Badge variant="info" className="mt-0.5 px-1.5 py-0 text-[10px]">
                  {currentAdmin.role}
                </Badge>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{currentAdmin.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-3.5 w-3.5" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-3.5 w-3.5" /> Account settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={handleSignOut}>
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
