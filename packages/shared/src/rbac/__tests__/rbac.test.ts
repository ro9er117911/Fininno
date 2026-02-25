import { describe, it, expect } from "vitest";
import { hasPermission, canViewPage, getPermissions } from "../index";

describe("RBAC guard", () => {
    // ─── Ops ───
    it("Ops can view dashboard", () => {
        expect(canViewPage("Ops", "dashboard")).toBe(true);
    });

    it("Ops can view transfers", () => {
        expect(canViewPage("Ops", "transfers")).toBe(true);
    });

    it("Ops cannot view approvals", () => {
        expect(canViewPage("Ops", "approvals")).toBe(false);
    });

    it("Ops can do opsReview", () => {
        expect(hasPermission("Ops", "action:transfer:opsReview")).toBe(true);
    });

    it("Ops cannot freeze", () => {
        expect(hasPermission("Ops", "action:transfer:freeze")).toBe(false);
    });

    it("Ops cannot unmask PII", () => {
        expect(hasPermission("Ops", "action:pii:unmask")).toBe(false);
    });

    // ─── Risk ───
    it("Risk can triage alerts", () => {
        expect(hasPermission("Risk", "action:alert:triage")).toBe(true);
    });

    it("Risk can freeze transfers", () => {
        expect(hasPermission("Risk", "action:transfer:freeze")).toBe(true);
    });

    it("Risk can unmask PII", () => {
        expect(hasPermission("Risk", "action:pii:unmask")).toBe(true);
    });

    it("Risk cannot approve final signoff", () => {
        expect(hasPermission("Risk", "action:transfer:approve")).toBe(false);
    });

    // ─── Approver ───
    it("Approver can view approvals", () => {
        expect(canViewPage("Approver", "approvals")).toBe(true);
    });

    it("Approver can approve transfers", () => {
        expect(hasPermission("Approver", "action:transfer:approve")).toBe(true);
    });

    it("Approver cannot view alerts page", () => {
        expect(canViewPage("Approver", "alerts")).toBe(false);
    });

    it("Approver cannot export reports", () => {
        expect(hasPermission("Approver", "action:report:export")).toBe(false);
    });

    // ─── Edge cases ───
    it("unknown page returns false", () => {
        expect(canViewPage("Ops", "nonexistent")).toBe(false);
    });

    it("getPermissions returns array", () => {
        const perms = getPermissions("Ops");
        expect(Array.isArray(perms)).toBe(true);
        expect(perms.length).toBeGreaterThan(0);
    });
});
