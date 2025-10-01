import type {Subscription} from "./types.ts";

const STORAGE_KEY = 'subscription-tracker';

export function loadSubscriptions(): Subscription[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        console.log("1")
        console.log({raw})
        if (!raw) return [];
        console.log("2")

        const parsed = JSON.parse(raw);
        console.log("3")
        if (!Array.isArray(parsed)) return [];
        console.log("4")
        console.log(parsed)
        return parsed as Subscription[];
    } catch {
        return [];
    }
}

export function saveSubscriptions(subscriptions: Subscription[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
}

export function upsertSubscription(
    subscriptions: Subscription[],
    next: Subscription
): Subscription[] {
    const idx = subscriptions.findIndex((s) => s.id === next.id);
    if (idx >= 0) {
        const copy = subscriptions.slice();
        copy[idx] = next;
        return copy;
    }
    return [next, ...subscriptions];
}

export function deleteSubscription(
    subscriptions: Subscription[],
    id: string
): Subscription[] {
    return subscriptions.filter((s) => s.id !== id);
}


