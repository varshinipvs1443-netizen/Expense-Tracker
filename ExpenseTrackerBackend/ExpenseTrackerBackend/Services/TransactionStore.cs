using ExpenseTracker.Api.Models;
namespace ExpenseTracker.Api.Services;

// Static in-memory store for learning. Data resets whenever the API process restarts.
public sealed class TransactionStore
{
    private readonly object _lock = new();
    private readonly List<Transaction> _items = new()
    {
        new(1, "Monthly salary", "Salary", 5200m, "2026-04-01", "Income", "October payroll"),
        new(2, "Apartment rent", "Housing", 1450m, "2026-10-02", "Expense", "Monthly rent"),
        new(3, "Whole Foods Market", "Food & Dining", 86.42m, "2026-10-03", "Expense", "Weekly groceries"),
        new(4, "Metro card refill", "Transport", 35m, "2026-10-04", "Expense", "Commuting"),
        new(5, "Freelance project", "Freelance", 780m, "2026-10-05", "Income", "Website project"),
        new(6, "Electricity bill", "Bills & Utilities", 74.80m, "2026-10-06", "Expense", "Monthly utility bill"),
        new(7, "Running shoes", "Shopping", 119.99m, "2026-10-07", "Expense", "Fitness gear"),
        new(8, "Coffee Corner", "Food & Dining", 12.50m, "2026-10-08", "Expense", "Coffee with a friend"),
        new(9, "Streaming subscription", "Entertainment", 15.99m, "2026-10-09", "Expense", "Monthly subscription"),
        new(10, "Pharmacy", "Health", 28.40m, "2026-10-10", "Expense", "Essentials"),
        new(11, "Dinner with friends", "Food & Dining", 54.75m, "2026-10-12", "Expense", "Weekend dinner"),
        new(12, "Train ticket", "Transport", 42.00m, "2026-10-13", "Expense", "Weekend trip"),
        new(13, "Consulting payment", "Freelance", 350m, "2026-10-14", "Income", "Consulting"),
        new(14, "Home supplies", "Shopping", 63.25m, "2026-10-16", "Expense", "Storage and supplies"),
        new(15, "Internet bill", "Bills & Utilities", 59.99m, "2026-10-18", "Expense", "Internet"),
        new(16, "Yoga studio", "Health", 45m, "2026-10-20", "Expense", "Monthly class"),
        new(17, "Bookshop", "Entertainment", 24.90m, "2026-10-22", "Expense", "Personal development"),
    };
    private int _nextId = 18;
    public IReadOnlyList<Transaction> GetAll() { lock (_lock) return _items.OrderByDescending(x => x.Date).ThenByDescending(x => x.Id).ToList(); }
    public Transaction? Get(int id) { lock (_lock) return _items.FirstOrDefault(x => x.Id == id); }
    public Transaction Add(CreateTransactionRequest request) { lock (_lock) { var item = new Transaction(_nextId++, request.Title.Trim(), request.Category.Trim(), request.Amount, request.Date, request.Type, request.Note?.Trim()); _items.Insert(0, item); return item; } }
    public bool Delete(int id) { lock (_lock) { var item = _items.FirstOrDefault(x => x.Id == id); return item is not null && _items.Remove(item); } }
    public DashboardSummary GetDashboard()
    {
        lock (_lock)
        {
            var income = _items.Where(x => x.Type == "Income").Sum(x => x.Amount);
            var expenses = _items.Where(x => x.Type == "Expense").Sum(x => x.Amount);
            var categoryColors = new Dictionary<string, string> { ["Food & Dining"] = "#7865e9", ["Housing"] = "#a99cf4", ["Transport"] = "#4da9dc", ["Shopping"] = "#f1a36a", ["Bills & Utilities"] = "#54c5a0", ["Health"] = "#ed7f9c", ["Entertainment"] = "#f3ce67" };
            var categories = _items.Where(x => x.Type == "Expense").GroupBy(x => x.Category).Select(g => new CategorySpending(g.Key, g.Sum(x => x.Amount), categoryColors.GetValueOrDefault(g.Key, "#9ca3af"))).OrderByDescending(x => x.Amount).ToList();
            var monthAmounts = new List<MonthlySpending>();
            var now = new DateOnly(2026, 10, 27);
            for (var offset = 5; offset >= 0; offset--)
            {
                var month = new DateOnly(now.Year, now.Month, 1).AddMonths(-offset);
                var amount = _items.Where(x => x.Type == "Expense" && DateOnly.TryParse(x.Date, out var d) && d.Year == month.Year && d.Month == month.Month).Sum(x => x.Amount);
                // Add plausible static history for months without seeded transactions.
                if (amount == 0) amount = 1600m + (month.Month * 73m % 600m);
                monthAmounts.Add(new MonthlySpending(month.ToString("MMM"), amount));
            }
            var savings = income <= 0 ? 0 : Math.Round((income - expenses) / income * 100, 1);
            return new DashboardSummary(income - expenses, income, expenses, savings, monthAmounts, categories, _items.OrderByDescending(x => x.Date).ThenByDescending(x => x.Id).Take(5).ToList());
        }
    }
}
