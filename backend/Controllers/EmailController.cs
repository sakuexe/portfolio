using System.Net;
using System.Net.Mail;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Persistence.EFCore.Scoping;

namespace backend.Controllers;

public record ContactFormModel(string Name, string Email, string? Subject, string Message);

[ApiController]
[Route("/api/email")]
public class EmailController(
    IOptions<GlobalSettings> globalSettings,
    ILogger<EmailController> logger,
    IWebHostEnvironment env,
    IEFCoreScopeProvider<DatabaseContext> efCoreScopeProvider
) : Controller
{
    private readonly GlobalSettings _globalSettings = globalSettings.Value;
    private readonly ILogger<EmailController> _logger = logger;
    private readonly IWebHostEnvironment _env = env;
    private readonly IEFCoreScopeProvider<DatabaseContext> _efCoreScopeProvider = efCoreScopeProvider;

    private const string EmailRecipient = "saku.karttunen@gmail.com";
    private const string SenderName = "api.sakukarttunen.com";

    [HttpPost("contactform")]
    public async Task<IActionResult> ContactForm(ContactFormModel model)
    {
        if (!AreSmtpSettingsValid())
            return StatusCode(StatusCodes.Status503ServiceUnavailable, "SMTP settings were not set correctly");

        string? emailError = SendEmail(model);
        if (!string.IsNullOrEmpty(emailError))
            return StatusCode(StatusCodes.Status503ServiceUnavailable, $"Email sending failed: {emailError}");

        ContactFormSubmission submission = new() 
        {
            Name = model.Name,
            Email = model.Email,
            Subject = model.Subject,
            Message = model.Message,
            CreatedUTC = DateTime.UtcNow
        };

        using IEfCoreScope<DatabaseContext> scope = _efCoreScopeProvider.CreateScope();
        await scope.ExecuteWithContextAsync<Task>(async db =>
        {
            await db.ContactFormSubmissions.AddAsync(submission);
            await db.SaveChangesAsync();
        });

        scope.Complete();
        return Ok("Email sent succesfully");
    }

    [HttpGet("contactform/submissions")]
    public async Task<IActionResult> ContactFormSubmissions()
    {
        using IEfCoreScope<DatabaseContext> scope = _efCoreScopeProvider.CreateScope();
        IEnumerable<ContactFormSubmission> submissions = await scope.ExecuteWithContextAsync(async db =>
        {
            return db.ContactFormSubmissions;
        });

        scope.Complete();
        return Ok(submissions);
    }

    private string? SendEmail(ContactFormModel model)
    {
        // configure Gmail SMTP
        using var smtp = new SmtpClient(_globalSettings.Smtp!.Host, _globalSettings.Smtp!.Port);
        smtp.Credentials = new NetworkCredential(
            _globalSettings.Smtp!.Username,
            _globalSettings.Smtp!.Password
        );
        smtp.EnableSsl = _env.IsProduction();

        var mail = new MailMessage
        {
            From = new MailAddress(_globalSettings.Smtp!.From, SenderName),
            Subject = model.Subject ?? "New contact form submission",
            Body = $"Name: {model.Name}\nEmail: {model.Email}\nMessage:\n{model.Message}",
            IsBodyHtml = false
        };
        mail.To.Add(EmailRecipient);

        try
        {
            smtp.Send(mail);
        }
        catch (SmtpException ex)
        {
            _logger.LogError(ex, "SMTP connection failed, check your authentication settings");
            return $"Could not connect to the SMTP server";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error happened while sending email");
            return $"Unexpected error happened while sending email";
        }

        return null;
    }

    private bool AreSmtpSettingsValid()
    {
        bool areValid = true;

        if (string.IsNullOrEmpty(_globalSettings.Smtp?.Host))
        {
            _logger.LogError("Setting {setting} is not configured", "Umbraco__CMS__Global__Smtp__Host");
            areValid = false;
        }
        if (_globalSettings.Smtp?.Port is null)
        {
            _logger.LogError("Setting {setting} is not configured", "Umbraco__CMS__Global__Smtp__Port");
            areValid = false;
        }
        if (string.IsNullOrEmpty(_globalSettings.Smtp?.Username))
        {
            _logger.LogError("Setting {setting} is not configured", "Umbraco__CMS__Global__Smtp__Username");
            areValid = false;
        }
        if (string.IsNullOrEmpty(_globalSettings.Smtp?.Password))
        {
            _logger.LogError("Setting {setting} is not configured", "Umbraco__CMS__Global__Smtp__Password");
            areValid = false;
        }
        if (string.IsNullOrEmpty(_globalSettings.Smtp?.From))
        {
            _logger.LogError("Setting {setting} is not configured", "Umbraco__CMS__Global__Smtp__From");
            areValid = false;
        }

        return areValid;
    }
}
