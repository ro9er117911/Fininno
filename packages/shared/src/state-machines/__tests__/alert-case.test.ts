import { describe, it, expect } from "vitest";
import { alertTransition } from "../alert";
import { caseTransition } from "../case";

describe("alertTransition", () => {
    it("New -> triage (Risk) = Triage", () => {
        const result = alertTransition("New", "triage", "Risk");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Triage");
    });

    it("Triage -> escalate (Risk) = Escalated", () => {
        const result = alertTransition("Triage", "escalate", "Risk");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Escalated");
    });

    it("Triage -> dismiss (Risk, reason) = Dismissed", () => {
        const result = alertTransition("Triage", "dismiss", "Risk", {
            reason: "False positive",
        });
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Dismissed");
    });

    it("dismiss without reason fails", () => {
        const result = alertTransition("Triage", "dismiss", "Risk");
        expect(result.success).toBe(false);
    });

    it("Ops cannot triage", () => {
        const result = alertTransition("New", "triage", "Ops");
        expect(result.success).toBe(false);
    });
});

describe("caseTransition", () => {
    it("Open -> investigate (Risk) = Investigating", () => {
        const result = caseTransition("Open", "investigate", "Risk");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Investigating");
    });

    it("Investigating -> file (Risk) = Filed", () => {
        const result = caseTransition("Investigating", "file", "Risk");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Filed");
    });

    it("Filed -> close (Risk, reason) = Closed", () => {
        const result = caseTransition("Filed", "close", "Risk", {
            reason: "STR filed and resolved",
        });
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Closed");
    });

    it("close without reason fails", () => {
        const result = caseTransition("Investigating", "close", "Risk");
        expect(result.success).toBe(false);
    });

    it("Ops cannot manage cases", () => {
        const result = caseTransition("Open", "investigate", "Ops");
        expect(result.success).toBe(false);
    });
});
