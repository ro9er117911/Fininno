"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserCog, UserCheck, Shield } from "lucide-react";
import type { Role } from "@fininno/shared";

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();

    const handleLogin = (role: Role, userName: string) => {
        login(role, userName);
        router.push("/dashboard");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Fininno Custody</CardTitle>
                    <CardDescription>銀行級虛擬資產保管平台 (Demo 登入)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start h-14 text-lg items-center gap-4"
                        onClick={() => handleLogin("Ops", "Alice (Ops)")}
                    >
                        <UserCog className="h-5 w-5 text-slate-500" />
                        <div className="text-left">
                            <div>以 Ops 身分登入</div>
                            <div className="text-xs text-muted-foreground font-normal">一般操作員：可建立申請、初審</div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-14 text-lg items-center gap-4"
                        onClick={() => handleLogin("Risk", "Bob (Risk)")}
                    >
                        <Shield className="h-5 w-5 text-red-500" />
                        <div className="text-left">
                            <div>以 Risk 身分登入</div>
                            <div className="text-xs text-muted-foreground font-normal">風控專員：風險審查、警示處理、凍結</div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-14 text-lg items-center gap-4"
                        onClick={() => handleLogin("Approver", "Charlie (Approver)")}
                    >
                        <UserCheck className="h-5 w-5 text-green-600" />
                        <div className="text-left">
                            <div>以 Approver 身分登入</div>
                            <div className="text-xs text-muted-foreground font-normal">高階主管：最終核決簽核</div>
                        </div>
                    </Button>
                </CardContent>
                <CardFooter className="text-center text-sm text-muted-foreground">
                    此版本為 UI 展示專用，無需輸入密碼。
                </CardFooter>
            </Card>
        </div>
    );
}
