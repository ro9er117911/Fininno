import type { Role } from "../domain/index";

/** Permission identifiers */
export type Permission =
    // View
    | "view:dashboard"
    | "view:customers"
    | "view:transfers"
    | "view:whitelist"
    | "view:alerts"
    | "view:cases"
    | "view:reports"
    | "view:audit"
    | "view:approvals"
    // Actions — Transfer
    | "action:transfer:submit"
    | "action:transfer:opsReview"
    | "action:transfer:riskReview"
    | "action:transfer:approve"
    | "action:transfer:freeze"
    | "action:transfer:unfreeze"
    // Actions — Whitelist
    | "action:whitelist:opsVerify"
    | "action:whitelist:riskCheck"
    // Actions — Alert & Case
    | "action:alert:triage"
    | "action:alert:dismiss"
    | "action:alert:escalate"
    | "action:case:investigate"
    | "action:case:file"
    | "action:case:close"
    // Actions — Reports
    | "action:report:export"
    | "action:report:reconcile"
    // Actions — PII
    | "action:pii:unmask";

/** Role → Permission mapping */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    Ops: [
        "view:dashboard",
        "view:customers",
        "view:transfers",
        "view:whitelist",
        "view:alerts",
        "view:cases",
        "view:reports",
        "view:audit",
        "action:transfer:submit",
        "action:transfer:opsReview",
        "action:whitelist:opsVerify",
        "action:report:export",
        "action:report:reconcile",
    ],
    Risk: [
        "view:dashboard",
        "view:customers",
        "view:transfers",
        "view:whitelist",
        "view:alerts",
        "view:cases",
        "view:reports",
        "view:audit",
        "action:transfer:riskReview",
        "action:transfer:freeze",
        "action:transfer:unfreeze",
        "action:whitelist:riskCheck",
        "action:alert:triage",
        "action:alert:dismiss",
        "action:alert:escalate",
        "action:case:investigate",
        "action:case:file",
        "action:case:close",
        "action:report:export",
        "action:pii:unmask",
    ],
    Approver: [
        "view:approvals",
        "view:dashboard",
        "view:transfers",
        "view:whitelist",
        "action:transfer:approve",
        "action:pii:unmask",
    ],
};

/** Check if a role has a specific permission */
export function hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** Get all permissions for a role */
export function getPermissions(role: Role): Permission[] {
    return ROLE_PERMISSIONS[role] ?? [];
}

/** Check if a role can view a specific page */
export function canViewPage(
    role: Role,
    page: string
): boolean {
    const pagePermissionMap: Record<string, Permission> = {
        dashboard: "view:dashboard",
        customers: "view:customers",
        transfers: "view:transfers",
        whitelist: "view:whitelist",
        alerts: "view:alerts",
        cases: "view:cases",
        reports: "view:reports",
        audit: "view:audit",
        approvals: "view:approvals",
    };

    const permission = pagePermissionMap[page];
    if (!permission) return false;
    return hasPermission(role, permission);
}
