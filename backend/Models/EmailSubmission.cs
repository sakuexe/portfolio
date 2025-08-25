using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class EmailSubmission
{
    public const string DatabaseTableName = "emailSubmission";

    [Key]
    public int Id { get; set; }

    [Required]
    [DataType(DataType.Text)]
    public required string Name { get; set; }

    [Required]
    [DataType(DataType.EmailAddress)]
    public required string Email { get; set; }

    [DataType(DataType.Text)]
    public string? Subject { get; set; }

    [Required]
    [DataType(DataType.MultilineText)]
    public required string Message { get; set; }
}
