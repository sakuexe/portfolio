using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Configuration.Models;

namespace backend.Controllers;

public record ContactFormModel(string Name, string Email, string Subject, string Message);

[ApiController]
[Route("/api/email")]
public class EmailController : Controller
{
    private readonly GlobalSettings _globalSettings;
    private readonly ILogger<EmailController> _logger;

    private const string EmailRecipient = "saku.karttunen@gmail.com";
    private const string SenderName = "api.sakukarttunen.com";

    public EmailController(ILogger<EmailController> logger, IOptions<GlobalSettings> globalSettings)
    {
        _globalSettings = globalSettings.Value;
        _logger = logger;
    }

    [HttpPost("contactform")]
    public IActionResult ContactForm(ContactFormModel model)
    {
        if (!AreSmtpSettingsValid())
            return StatusCode(StatusCodes.Status503ServiceUnavailable, "SMTP settings were not set correctly");

        string? emailError = SendEmail(model);
        if (!string.IsNullOrEmpty(emailError))
            return StatusCode(StatusCodes.Status503ServiceUnavailable, $"Email sending failed: {emailError}");

        return Ok("Email sent succesfully");
    }

    private string? SendEmail(ContactFormModel model)
    {
        // configure Gmail SMTP
        using var smtp = new SmtpClient(_globalSettings.Smtp!.Host, _globalSettings.Smtp!.Port);
        smtp.Credentials = new NetworkCredential(
            _globalSettings.Smtp!.Username,
            _globalSettings.Smtp!.Password
        );
        smtp.EnableSsl = true;

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
