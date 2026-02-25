"use client";

import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";
import type { Role } from "@fininno/shared";
import { useRouter } from "next/navigation";

export function Header() {
    const { role, userName, login, logout } = useAuthStore();
    const router = useRouter();

    if (!role) return null;

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-white px-6 lg:h-[60px]">
            <div className="flex-1">
                {/* Breadcrumbs could go here */}
            </div>

            {/* Demo Role Switcher */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span className="hidden md:inline">{userName}</span>
                        <span className="md:hidden">{role}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>切換身分 (Demo Mode)</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {[
                        { role: "Ops", name: "Alice (Ops)" },
                        { role: "Risk", name: "Bob (Risk)" },
                        { role: "Approver", name: "Charlie (Approver)" },
                    ].map((r) => (
                        <DropdownMenuItem
                            key={r.role}
                            onClick={() => {
                                login(r.role as Role, r.name);
                                router.refresh(); // refresh server components
                            }}
                            className="justify-between"
                        >
                            {r.name}
                            {role === r.role && <span className="text-blue-500">✓</span>}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                        logout();
                        router.push("/login");
                    }}>
                        登出
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
