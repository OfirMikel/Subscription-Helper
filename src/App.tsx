import './App.css'
import {computeTotals, type Subscription} from "./types.ts";
import {useEffect, useMemo, useState} from "react";
import {deleteSubscription, loadSubscriptions, saveSubscriptions, upsertSubscription} from "./storage.ts";
import SubscriptionList from "./components/SubscriptionList.tsx";
import SubscriptionForm from "./components/SubscriptionForm.tsx";
import {Plus, X} from 'lucide-react';

function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function App() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(loadSubscriptions())
    const [editing, setEditing] = useState<Subscription | null>(null)
    const [showForm, setShowForm] = useState<boolean>(false)


    useEffect(() => {
        saveSubscriptions(subscriptions)
    }, [subscriptions])

    const totals = useMemo(() => computeTotals(subscriptions), [subscriptions])

    function handleAddOrSave(partial: Partial<Subscription>) {
        const nowIso = new Date().toISOString()
        if (partial.id) {
            const next: Subscription = {
                ...(editing as Subscription),
                ...partial,
                updatedAt: nowIso,
            } as Subscription
            setSubscriptions((prev) => upsertSubscription(prev, next))
            setEditing(null)
            setShowForm(false)
            return
        }
        const next: Subscription = {
            id: uid(),
            name: partial.name!,
            price: partial.price!,
            billingCycle: partial.billingCycle!,
            nextPaymentDate: partial.nextPaymentDate,
            category: partial.category,
            createdAt: nowIso,
            updatedAt: nowIso,
        }
        setSubscriptions((prev) => upsertSubscription(prev, next))
        setShowForm(false)
    }

    function handleDelete(id: string) {
        setSubscriptions((prev) => deleteSubscription(prev, id))
        if (editing && editing.id === id) setEditing(null)
    }

    return (
        <div className="container">
            <header className="header">
                <h1>Subscription Tracker</h1>
                <div className="totals">
                    <div className="total">
                        <span className="label">Monthly</span>
                        <strong>${totals.totalMonthly.toFixed(2)}</strong>
                    </div>
                    <div className="total">
                        <span className="label">Yearly</span>
                        <strong>${totals.totalYearly.toFixed(2)}</strong>
                    </div>
                </div>
            </header>

            <main>
                <SubscriptionList
                    subscriptions={subscriptions}
                    onEdit={(s) => setEditing(s)}
                    onDelete={handleDelete}
                />

                {(showForm || editing) && (
                    <section className="panel">
                        <div className="panel-header">
                            <h2>{editing ? 'Edit Subscription' : 'Add Subscription'}</h2>
                            <X className={"icon"} onClick={() => {
                                setEditing(null)
                                setShowForm(false)
                            }}/>
                        </div>
                        <SubscriptionForm
                            initial={editing ?? undefined}
                            onSubmit={handleAddOrSave}
                            onCancel={() => {
                                setEditing(null)
                                setShowForm(false)
                            }}
                        />
                    </section>
                )}
            </main>

            {!showForm && !editing && (
                <button
                    className="fab"
                    aria-label="Add subscription"
                    title="Add subscription"
                    onClick={() => setShowForm(true)}
                >
                    <Plus/>
                </button>
            )}
        </div>
    )
}

export default App
