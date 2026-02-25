import type {
    AlertState,
    AlertAction,
    Role,
    TransitionResult,
} from "../domain/index.js";

const ALERT_TRANSITIONS: Record<
    string,
    { nextState: AlertState; allowedRoles: Role[]; auditEventType: string }
> = {
    "New->triage": {
        nextState: "Triage",
        allowedRoles: ["Risk"],
        auditEventType: "ALERT_TRIAGED",
    },
    "Triage->dismiss": {
        nextState: "Dismissed",
        allowedRoles: ["Risk"],
        auditEventType: "ALERT_DISMISSED",
    },
    "Triage->escalate": {
        nextState: "Escalated",
        allowedRoles: ["Risk"],
        auditEventType: "ALERT_ESCALATED",
    },
};

export function alertTransition(
    currentState: AlertState,
    action: AlertAction,
    actorRole: Role,
    context?: { reason?: string }
): TransitionResult<AlertState> {
    const key = `${currentState}->${action}`;
    const rule = ALERT_TRANSITIONS[key];

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

    if (action === "dismiss" && !context?.reason) {
        return {
            success: false,
            error: `Action "dismiss" requires a reason`,
        };
    }

    return {
        success: true,
        nextState: rule.nextState,
        auditEventType: rule.auditEventType as any,
    };
}
