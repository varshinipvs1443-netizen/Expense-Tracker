
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { transactionApi } from "../api/transactions";
import { useExpenses } from "../state/ExpenseContext";
import type { DashboardSummary } from "../types";

import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";

const currency = (n: number) =>
    n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });

export default function Dashboard() {
    const { transactions, loading, error } = useExpenses();

    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [period, setPeriod] = useState("6 months");

    useEffect(() => {
        transactionApi
            .getDashboard()
            .then(setSummary)
            .catch(() => setSummary(null));
    }, [transactions.length]);

    const latest = useMemo(
        () =>
            [...transactions]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 5),
        [transactions]
    );

    const max = Math.max(
        ...(summary?.monthlySpending.map((x) => x.amount) ?? [1]),
        1
    );

    return (
        <>
            <div className="page-heading">
                <div>
                    <h2>Overview</h2>
                    <p>Track your money. Build your future.</p>
                </div>

                <span className="date-chip">
                    ◷{" "}
                    {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
            </div>

            {error && <div className="alert">{error}</div>}

            <section className="stats-grid">
                <StatCard
                    label="Total balance"
                    value={currency(summary?.balance ?? 0)}
                    trend="12.8%"
                    icon="₹"
                    tone="purple"
                />

                <StatCard
                    label="Income"
                    value={currency(summary?.income ?? 0)}
                    trend="8.2%"
                    icon="↗"
                    tone="green"
                />

                <StatCard
                    label="Expenses"
                    value={currency(summary?.expenses ?? 0)}
                    trend="4.6%"
                    icon="↘"
                    tone="orange"
                />

                <StatCard
                    label="Savings rate"
                    value={`${summary?.savingsRate ?? 0}%`}
                    trend="2.4%"
                    icon="◉"
                    tone="blue"
                />
            </section>

            <section className="dashboard-grid">
                <article className="panel spending-panel">
                    <div className="panel-heading">
                        <div>
                            <h3>Spending overview</h3>
                            <p>Keep an eye on your monthly outflow</p>
                        </div>

                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            aria-label="Spending period"
                        >
                            <option>6 months</option>
                            <option>12 months</option>

                        </select>
                    </div>

                    <div className="chart-total">
                        <strong>
                            {currency(summary?.expenses ?? 0)}
                        </strong>

                        <span className="positive">↘ 4.6%</span>

                        <small>total expenses</small>
                    </div>

                    <div className="bar-chart">
                        {(summary?.monthlySpending ?? [])
                            .slice(period === "6 months" ? -6 : -12)
                            .map((m, i) => (
                                <div className="bar-group" key={m.month}>
                                    <div className="bar-track">
                                        <div
                                            className={`bar ${
                                                i === 4 ? "highlight" : ""
                                            }`}
                                            style={{
                                                height: `${Math.max(
                                                    5,
                                                    (m.amount / max) * 100
                                                )}%`,
                                            }}
                                            title={currency(m.amount)}
                                        />
                                    </div>

                                    <small>{m.month}</small>
                                </div>
                            ))}
                    </div>
                </article>

                <article className="panel category-panel">
                    <div className="panel-heading">
                        <div>
                            <h3>By category</h3>
                            <p>Where your money goes</p>
                        </div>

                        <button
                            className="text-button"
                            onClick={() =>
                                window.location.assign("/transactions")
                            }
                        >
                            Details ↗
                        </button>
                    </div>

                    <div className="donut-area">
                        <div
                            className="donut"
                            style={{
                                background: `conic-gradient(${(
                                    summary?.categorySpending ?? []
                                )
                                    .map((c, i, arr) => {
                                        const total =
                                            arr.reduce(
                                                (s, x) => s + x.amount,
                                                0
                                            ) || 1;

                                        const start =
                                            (arr
                                                .slice(0, i)
                                                .reduce(
                                                    (s, x) => s + x.amount,
                                                    0
                                                ) /
                                                total) *
                                            100;

                                        const end =
                                            start + (c.amount / total) * 100;

                                        return `${c.color} ${start}% ${end}%`;
                                    })
                                    .join(", ")})`,
                            }}
                        >
                            <div>
                                <strong>
                                    {currency(summary?.expenses ?? 0)}
                                </strong>

                                <small>Spent</small>
                            </div>
                        </div>
                    </div>

                    <div className="legend">
                        {(summary?.categorySpending ?? [])
                            .slice(0, 4)
                            .map((c) => (
                                <div key={c.category}>
                                    <span>
                                        <i
                                            style={{
                                                background: c.color,
                                            }}
                                        />
                                        {c.category}
                                    </span>

                                    <strong>{currency(c.amount)}</strong>
                                </div>
                            ))}
                    </div>
                </article>
            </section>

            <section className="panel recent-panel">
                <div className="panel-heading">
                    <div>
                        <h3>Recent transactions</h3>
                        <p>Your latest activity at a glance</p>
                    </div>

                    <Link className="text-button" to="/transactions">
                        View all transactions ↗
                    </Link>
                </div>

                {loading ? (
                    <div className="empty-state">
                        Loading transactions…
                    </div>
                ) : (
                    <TransactionTable transactions={latest} />
                )}
            </section>
        </>
    );
}
