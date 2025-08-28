using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Infrastructure.Scoping;
using static backend.Notifications.AddContactFormSubmissionTable;

namespace backend.Controllers;

public record ContactFormModel(string Name, string Email, string? Subject, string Message);
public record ContactFormSubmission(string Name, string Email, string? Subject, string Message, DateTime CreatedUtc);

[ApiController]
[Route("/api/email")]
public class EmailController(
    IOptions<GlobalSettings> globalSettings,
    ILogger<EmailController> logger,
    IWebHostEnvironment env,
    IScopeProvider scopeProvider
) : Controller
{
    private readonly GlobalSettings _globalSettings = globalSettings.Value;
    private readonly ILogger<EmailController> _logger = logger;
    private readonly IWebHostEnvironment _env = env;
    private readonly IScopeProvider _scopeProvider = scopeProvider;

    private const string EmailRecipient = "saku.karttunen@gmail.com";
    private const string SenderName = "api.sakukarttunen.com";

    [HttpPost("contactform")]
    public async Task<IActionResult> ContactForm(ContactFormModel model)
    {
        if (!AreSmtpSettingsValid())
            return StatusCode(StatusCodes.Status503ServiceUnavailable, "SMTP settings were not set correctly");

        string? emailError = SendEmail(model);
        if (!string.IsNullOrEmpty(emailError))
            _logger.LogWarning("Email was not be sent because of an error: {errorMessage}", emailError);

        var submission = new ContactFormSubmission(model.Name, model.Email, model.Subject, model.Message, DateTime.UtcNow);

        using var scope = _scopeProvider.CreateScope();
        await scope.Database.InsertAsync<ContactFormSubmission>(submission);
        bool saveSuccess = scope.Complete(); // remember to close the scope (I forgor and spent too much time on it)
        if (!saveSuccess)
            _logger.LogWarning("Email submission could not be saved to the database");

        if (!string.IsNullOrEmpty(emailError) && !saveSuccess)
        {
            _logger.LogError(
                "Email submission failed both saving and sending. Name: {name}, Email: {email}, Subject: {subject}, Message: {message}",
                model.Name, model.Email, 
                model.Subject, model.Message
            );
            return StatusCode(StatusCodes.Status503ServiceUnavailable, $"Email could not be recieved");
        }

        return Ok("Email sent succesfully");
    }

    [HttpGet("contactform/submissions")]
    public async Task<IActionResult> ContactFormSubmissions()
    {

        using var scope = _scopeProvider.CreateScope();
        var queryResults = await scope.Database.FetchAsync<ContactFormModel>("SELECT * FROM @0", ContactFormSubmissionSchema.TableName);
        scope.Complete();
        return Ok(queryResults);
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
