using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    public required DbSet<EmailSubmission> EmailSubmissions { get; set; }
}
