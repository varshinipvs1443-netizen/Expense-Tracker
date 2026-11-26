
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import TransactionTable from "../components/TransactionTable";
import { useExpenses } from "../state/ExpenseContext";

export default function Transactions() {
    const { transactions, deleteTransaction } = useExpenses();

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All categories");
    const [type, setType] = useState("All types");

    const categories = useMemo(
        () => [
            "All categories",
            ...Array.from(new Set(transactions.map((t) => t.category))),
        ],
        [transactions]
    );

    const filtered = useMemo(
        () =>
            transactions.filter(
                (t) =>
                    `${t.title} ${t.category}`
                        .toLowerCase()
                        .includes(query.toLowerCase()) &&
                    (category === "All categories" || t.category === category) &&
                    (type === "All types" || t.type === type)
            ),
        [transactions, query, category, type]
    );

    return (
        <>
            <div className="page-heading">
                <div>
                    <h2>Transactions</h2>
                    <p>All your income and expenses in one place.</p>
                </div>

                <Link className="primary-button" to="/add-expense">
                    ＋ Add transaction
                </Link>
            </div>

            <section className="panel transactions-panel">
                <div className="filter-row">
                    <label className="search-box">
                        ⌕
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search transactions…"
                        />
                    </label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        aria-label="Filter category"
                    >
                        {categories.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        aria-label="Filter type"
                    >
                        <option>All types</option>
                        <option>Expense</option>
                        <option>Income</option>
                    </select>
                </div>

                <div className="result-count">
                    Showing {filtered.length} of {transactions.length} transactions
                </div>

                <TransactionTable
                    transactions={filtered}
                    onDelete={(id) => {
                        if (window.confirm("Delete this transaction?")) {
                            void deleteTransaction(id);
                        }
                    }}
                />
            </section>
        </>
    );
}
