using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    public required DbSet<ContactFormSubmission> ContactFormSubmissions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) =>
        modelBuilder.Entity<ContactFormSubmission>(entity =>
        {
            entity.ToTable(ContactFormSubmission.DatabaseTableName);
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(256);
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(256);
            entity.Property(e => e.Subject).HasColumnName("subject").HasMaxLength(256);
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.CreatedUTC).HasColumnName("createdUtc");
        });
}
