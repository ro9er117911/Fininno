import { describe, it, expect } from "vitest";
import { whitelistTransition } from "../whitelist";

describe("whitelistTransition", () => {
    it("Requested -> verify (Ops) = OpsVerify", () => {
        const result = whitelistTransition("Requested", "verify", "Ops");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("OpsVerify");
    });

    it("OpsVerify -> passOps (Ops) = RiskScoreCheck", () => {
        const result = whitelistTransition("OpsVerify", "passOps", "Ops");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("RiskScoreCheck");
    });

    it("RiskScoreCheck -> passRisk (Risk) = Approved", () => {
        const result = whitelistTransition("RiskScoreCheck", "passRisk", "Risk");
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Approved");
    });

    it("OpsVerify -> rejectOps (Ops, reason) = Rejected", () => {
        const result = whitelistTransition("OpsVerify", "rejectOps", "Ops", {
            reason: "Suspicious address",
        });
        expect(result.success).toBe(true);
        if (result.success) expect(result.nextState).toBe("Rejected");
    });

    it("rejectOps without reason fails", () => {
        const result = whitelistTransition("OpsVerify", "rejectOps", "Ops");
        expect(result.success).toBe(false);
    });

    it("Risk cannot verify (Ops only)", () => {
        const result = whitelistTransition("Requested", "verify", "Risk");
        expect(result.success).toBe(false);
    });

    it("Ops cannot passRisk", () => {
        const result = whitelistTransition("RiskScoreCheck", "passRisk", "Ops");
        expect(result.success).toBe(false);
    });

    it("Approved is terminal", () => {
        const result = whitelistTransition("Approved", "verify", "Ops");
        expect(result.success).toBe(false);
    });
});
