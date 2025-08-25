namespace backend.Models;

public class ContactFormSubmission
{
    public const string DatabaseTableName = "contactFormSubmission";

    public int Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    public string? Subject { get; set; }

    public required string Message { get; set; }

    public required DateTime CreatedUTC { get; set; }
}
