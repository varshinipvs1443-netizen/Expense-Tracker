
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddSingleton<TransactionStore>();

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS configuration for separate React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("frontend");

// Root endpoint
app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        name = "Expense Tracker API",
        status = "running",
        docs = "/swagger"
    });
});

// Get all transactions
app.MapGet("/api/transactions", (TransactionStore store) =>
{
    return Results.Ok(store.GetAll());
});

// Get transaction by ID
app.MapGet("/api/transactions/{id:int}", (int id, TransactionStore store) =>
{
    var transaction = store.Get(id);

    return transaction is not null
        ? Results.Ok(transaction)
        : Results.NotFound();
});

// Create transaction
app.MapPost("/api/transactions", (
    CreateTransactionRequest request,
    TransactionStore store) =>
{
    if (
        string.IsNullOrWhiteSpace(request.Title) ||
        request.Amount <= 0 ||
        string.IsNullOrWhiteSpace(request.Category) ||
        string.IsNullOrWhiteSpace(request.Date) ||
        (request.Type != "Expense" && request.Type != "Income")
    )
    {
        return Results.BadRequest(new
        {
            message = "Title, category, date, valid type and a positive amount are required."
        });
    }

    if (!DateOnly.TryParse(request.Date, out _))
    {
        return Results.BadRequest(new
        {
            message = "Date must use a valid date format such as yyyy-MM-dd."
        });
    }

    var created = store.Add(request);

    return Results.Created(
        $"/api/transactions/{created.Id}",
        created
    );
});

// Delete transaction
app.MapDelete("/api/transactions/{id:int}", (
    int id,
    TransactionStore store) =>
{
    return store.Delete(id)
        ? Results.NoContent()
        : Results.NotFound();
});

// Dashboard summary
app.MapGet("/api/dashboard", (TransactionStore store) =>
{
    return Results.Ok(store.GetDashboard());
});

// Run application
app.Run();
