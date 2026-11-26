namespace ExpenseTracker.Api.Models;
public sealed record Transaction(int Id, string Title, string Category, decimal Amount, string Date, string Type, string? Note);
public sealed record CreateTransactionRequest(string Title, string Category, decimal Amount, string Date, string Type, string? Note);
public sealed record CategorySpending(string Category, decimal Amount, string Color);
public sealed record MonthlySpending(string Month, decimal Amount);
public sealed record DashboardSummary(decimal Balance, decimal Income, decimal Expenses, decimal SavingsRate, IReadOnlyList<MonthlySpending> MonthlySpending, IReadOnlyList<CategorySpending> CategorySpending, IReadOnlyList<Transaction> RecentTransactions);
