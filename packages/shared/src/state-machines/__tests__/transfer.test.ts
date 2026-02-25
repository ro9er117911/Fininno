import { describe, it, expect } from "vitest";
import { transferTransition } from "../transfer";

describe("transferTransition", () => {
    // ─── Happy Path ───
    it("Draft -> submit (Ops) = Submitted", () => {
        const result = transferTransition("Draft", "submit", "Ops");
        expect(result).toEqual({
            success: true,
            nextState: "Submitted",
            auditEventType: "TRANSFER_SUBMITTED",
        });
    });

    it("Submitted -> assignOps (Ops) = OpsReview", () => {
        const result = transferTransition("Submitted", "assignOps", "Ops");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("OpsReview");
    });

    it("OpsReview -> approveOps (Ops) = RiskReview", () => {
        const result = transferTransition("OpsReview", "approveOps", "Ops");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("RiskReview");
    });

    it("RiskReview -> approveRisk (Risk) = ApproverSignoff", () => {
        const result = transferTransition("RiskReview", "approveRisk", "Risk");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("ApproverSignoff");
    });

    it("ApproverSignoff -> approve (Approver) = Scheduled", () => {
        const result = transferTransition("ApproverSignoff", "approve", "Approver");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Scheduled");
    });

    it("Scheduled -> execute (Ops) = Executed", () => {
        const result = transferTransition("Scheduled", "execute", "Ops");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Executed");
    });

    // ─── Rejection Path ───
    it("OpsReview -> rejectOps (Ops) = Rejected (with reason)", () => {
        const result = transferTransition("OpsReview", "rejectOps", "Ops", {
            reason: "Address mismatch",
        });
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Rejected");
    });

    it("OpsReview -> rejectOps (Ops) fails without reason", () => {
        const result = transferTransition("OpsReview", "rejectOps", "Ops");
        expect(result.success).toBe(false);
        if (!result.success)
            expect(result.error).toContain("requires a reason");
    });

    // ─── Freeze / Unfreeze ───
    it("RiskReview -> freeze (Risk) = Frozen", () => {
        const result = transferTransition("RiskReview", "freeze", "Risk", {
            reason: "Suspicious activity detected",
        });
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Frozen");
    });

    it("Frozen -> unfreeze (Risk) = RiskReview", () => {
        const result = transferTransition("Frozen", "unfreeze", "Risk", {
            reason: "Investigation completed — cleared",
        });
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("RiskReview");
    });

    it("freeze without reason fails", () => {
        const result = transferTransition("RiskReview", "freeze", "Risk");
        expect(result.success).toBe(false);
    });

    // ─── RBAC Enforcement ───
    it("Risk cannot submit transfers", () => {
        const result = transferTransition("Draft", "submit", "Risk");
        expect(result.success).toBe(false);
        if (!result.success) expect(result.error).toContain("not allowed");
    });

    it("Ops cannot approve final signoff", () => {
        const result = transferTransition("ApproverSignoff", "approve", "Ops");
        expect(result.success).toBe(false);
    });

    it("Approver cannot freeze", () => {
        const result = transferTransition("RiskReview", "freeze", "Approver", {
            reason: "test",
        });
        expect(result.success).toBe(false);
    });

    // ─── Invalid Transitions ───
    it("Draft -> approve is invalid", () => {
        const result = transferTransition("Draft", "approve", "Approver");
        expect(result.success).toBe(false);
        if (!result.success) expect(result.error).toContain("Invalid transition");
    });

    it("Executed -> submit is invalid (terminal state)", () => {
        const result = transferTransition("Executed", "submit", "Ops");
        expect(result.success).toBe(false);
    });
});
