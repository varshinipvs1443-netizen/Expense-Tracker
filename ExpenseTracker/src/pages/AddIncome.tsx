
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useExpenses } from "../state/ExpenseContext";

interface IncomeValues {
    title: string;
    amount: string;
    category: string;
    date: string;
    note: string;
}

export default function AddIncome() {
    const { addTransaction } = useExpenses();
    const navigate = useNavigate();

    const [saveError, setSaveError] = React.useState("");

    const initialValues: IncomeValues = {
        title: "",
        amount: "",
        category: "Salary",
        date: new Date().toISOString().slice(0, 10),
        note: "",
    };

    return (
        <>
            <div className="page-heading">
                <div>
                    <h2>Add income</h2>
                    <p>
                        Log salary, freelance payments, or other money received.
                    </p>
                </div>
            </div>

            <section className="panel form-panel">
                <div className="form-intro">
                    <span className="large-form-icon income-icon">↗</span>

                    <div>
                        <h3>Income details</h3>
                        <p>This form demonstrates Formik form handling.</p>
                    </div>
                </div>

                {saveError && <div className="alert">{saveError}</div>}

                <Formik
                    initialValues={initialValues}
                    validate={(v) => {
                        const e: Partial<
                            Record<keyof IncomeValues, string>
                        > = {};

                        if (!v.title.trim()) {
                            e.title = "Enter an income name.";
                        }

                        if (!v.amount || Number(v.amount) <= 0) {
                            e.amount =
                                "Enter an amount greater than zero.";
                        }

                        if (!v.date) {
                            e.date = "Choose a date.";
                        }

                        return e;
                    }}
                    onSubmit={async (values, helpers) => {
                        try {
                            await addTransaction({
                                ...values,
                                amount: Number(values.amount),
                                type: "Income",
                            });

                            navigate("/transactions");
                        } catch {
                            setSaveError(
                                "Unable to save. Check that the API is running."
                            );
                        } finally {
                            helpers.setSubmitting(false);
                        }
                    }}
                >
                    <Form className="form-grid">
                        <label className="field full">
                            Income source *

                            <Field
                                name="title"
                                placeholder="e.g. Monthly salary"
                            />

                            <ErrorMessage
                                name="title"
                                component="small"
                                className="field-error"
                            />
                        </label>

                        <label className="field">
                            Amount (USD) *

                            <Field
                                name="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="0.00"
                            />

                            <ErrorMessage
                                name="amount"
                                component="small"
                                className="field-error"
                            />
                        </label>

                        <label className="field">
                            Category

                            <Field as="select" name="category">
                                {[
                                    "Salary",
                                    "Freelance",
                                    "Investment",
                                    "Gift",
                                    "Other income",
                                ].map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </Field>
                        </label>

                        <label className="field">
                            Date *

                            <Field name="date" type="date" />

                            <ErrorMessage
                                name="date"
                                component="small"
                                className="field-error"
                            />
                        </label>

                        <label className="field">
                            Note (optional)

                            <Field
                                name="note"
                                placeholder="Add a short note"
                            />
                        </label>

                        <div className="form-actions full">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Save income
                            </button>
                        </div>
                    </Form>
                </Formik>
            </section>
        </>
    );
}
