
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../state/ExpenseContext';

interface ExpenseForm {
    title: string;
    amount: number;
    category: string;
    date: string;
    note: string;
}

export default function AddExpense() {
    const { addTransaction } = useExpenses();
    const navigate = useNavigate();

    const [saveError, setSaveError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ExpenseForm>({
        defaultValues: {
            date: new Date().toISOString().slice(0, 10),
            category: 'Food & Dining'
        }
    });

    const onSubmit = async (values: ExpenseForm) => {
        try {
            await addTransaction({
                ...values,
                amount: Number(values.amount),
                type: 'Expense'
            });

            navigate('/transactions');
        } catch {
            setSaveError('Unable to save. Check that the API is running.');
        }
    };

    return (
        <>
            <div className="page-heading">
                <div>
                    <h2>Add expense</h2>
                    <p>Record a purchase and keep your budget up to date.</p>
                </div>
            </div>

            <section className="panel form-panel">
                <div className="form-intro">
                    <span className="large-form-icon">↘</span>

                    <div>
                        <h3>Expense details</h3>
                        <p>Fields marked with * are required.</p>
                    </div>
                </div>

                {saveError && (
                    <div className="alert">
                        {saveError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="form-grid"
                >
                    <label className="field full">
                        Expense name *

                        <input
                            placeholder="e.g. Weekly groceries"
                            {...register('title', {
                                required: 'Enter an expense name.',
                                minLength: {
                                    value: 2,
                                    message: 'Use at least 2 characters.'
                                }
                            })}
                        />

                        {errors.title && (
                            <small className="field-error">
                                {errors.title.message}
                            </small>
                        )}
                    </label>

                    <label className="field">
                        Amount (USD) *

                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            {...register('amount', {
                                required: 'Enter an amount.',
                                valueAsNumber: true,
                                min: {
                                    value: 0.01,
                                    message: 'Amount must be positive.'
                                }
                            })}
                        />

                        {errors.amount && (
                            <small className="field-error">
                                {errors.amount.message}
                            </small>
                        )}
                    </label>

                    <label className="field">
                        Category *

                        <select
                            {...register('category', {
                                required: true
                            })}
                        >
                            {[
                                'Food & Dining',
                                'Transport',
                                'Shopping',
                                'Bills & Utilities',
                                'Health',
                                'Entertainment',
                                'Housing',
                                'Other'
                            ].map(category => (
                                <option key={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="field">
                        Date *

                        <input
                            type="date"
                            {...register('date', {
                                required: 'Choose a date.'
                            })}
                        />

                        {errors.date && (
                            <small className="field-error">
                                {errors.date.message}
                            </small>
                        )}
                    </label>

                    <label className="field">
                        Note (optional)

                        <input
                            placeholder="Add a short note"
                            {...register('note')}
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
                            className="primary-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving…' : 'Save expense'}
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}
