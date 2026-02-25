import type {
    CaseState,
    CaseAction,
    Role,
    TransitionResult,
} from "../domain/index.js";

const CASE_TRANSITIONS: Record<
    string,
    { nextState: CaseState; allowedRoles: Role[]; auditEventType: string }
> = {
    "Open->investigate": {
        nextState: "Investigating",
        allowedRoles: ["Risk"],
        auditEventType: "CASE_INVESTIGATING",
    },
    "Investigating->file": {
        nextState: "Filed",
        allowedRoles: ["Risk"],
        auditEventType: "CASE_FILED",
    },
    "Investigating->close": {
        nextState: "Closed",
        allowedRoles: ["Risk"],
        auditEventType: "CASE_CLOSED",
    },
    "Filed->close": {
        nextState: "Closed",
        allowedRoles: ["Risk"],
        auditEventType: "CASE_CLOSED",
    },
};

export function caseTransition(
    currentState: CaseState,
    action: CaseAction,
    actorRole: Role,
    context?: { reason?: string }
): TransitionResult<CaseState> {
    const key = `${currentState}->${action}`;
    const rule = CASE_TRANSITIONS[key];

    if (!rule) {
        return {
            success: false,
            error: `Invalid transition: ${currentState} -> ${action}`,
        };
    }

    if (!rule.allowedRoles.includes(actorRole)) {
        return {
            success: false,
            error: `Role "${actorRole}" is not allowed to perform "${action}" on state "${currentState}"`,
        };
    }

    if (action === "close" && !context?.reason) {
        return {
            success: false,
            error: `Action "close" requires a reason`,
        };
    }

    return {
        success: true,
        nextState: rule.nextState,
        auditEventType: rule.auditEventType as any,
    };
}
