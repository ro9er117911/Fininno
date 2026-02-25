"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { canViewPage } from "@fininno/shared";
import {
    LayoutDashboard,
    Users,
    ArrowRightLeft,
    ShieldAlert,
    FileCheck,
    FileText,
    ShieldCheck,
    BookOpen
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const { role } = useAuthStore();

    if (!role) return null;

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, id: "dashboard" },
        { name: "客戶列表", href: "/customers", icon: Users, id: "customers" },
        { name: "出入庫申請", href: "/custody/transfers", icon: ArrowRightLeft, id: "transfers" },
        { name: "地址白名單", href: "/custody/whitelist", icon: ShieldCheck, id: "whitelist" },
        { name: "待審工作台", href: "/approvals", icon: FileCheck, id: "approvals" },
        { name: "警示中心", href: "/risk/alerts", icon: ShieldAlert, id: "alerts" },
        { name: "報表與對帳", href: "/reports/reconciliation", icon: FileText, id: "reports" },
        { name: "Demo Runbook", href: "/demo-runbook", icon: BookOpen, id: "dashboard" }, // everyone can see demo
    ];

    return (
        <div className="flex h-full w-64 flex-col border-r bg-slate-50">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                    <span>Fininno Custody</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-2 text-sm font-medium">
                    {navItems.map((item) => {
                        // Check RBAC permission for this nav item
                        if (!canViewPage(role, item.id)) return null;

                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900",
                                    isActive ? "bg-slate-200 text-slate-900" : ""
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
