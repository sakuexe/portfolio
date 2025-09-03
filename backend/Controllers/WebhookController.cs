using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("/api/webhooks")]
public class WebhooksController(
    ILogger<EmailController> logger,
    IHttpClientFactory httpClientFactory,
    IConfiguration cfg
) : Controller
{
    private readonly ILogger<EmailController> _logger = logger;

    [HttpPost("rebuild")]
    public async Task<IActionResult> RebuildFrontend([FromHeader(Name = "X-Webhook-Secret")] string? secret)
    {
        var expected = cfg.GetValue<string>("Webhook:Secret");

        if (string.IsNullOrEmpty(expected) || !string.Equals(secret, expected, StringComparison.Ordinal))
        {
            _logger.LogError("Rebuild frontend failed because invalid secret was not provided correctly");
            return Unauthorized("invalid secret");
        }

        var token = cfg.GetValue<string>("GitHub:Token");
        var repo = cfg.GetValue<string>("GitHub:Repo"); // "OWNER/REPO"
        var hookName = cfg.GetValue<string>("GitHub:HookName"); // "external_hook"
        var targetBranch = cfg.GetValue<string>("GitHub:TargetBranch"); // "prod"

        if (string.IsNullOrEmpty(token)) return StatusCode(500, "Missing GitHub token");

        var url = $"https://api.github.com/repos/{repo}/dispatches";
        var requestBody = new
        {
            @event_type = hookName,
            @client_payload = new
            {
                @ref = $"refs/heads/{targetBranch}"
            }
        };
        var client = httpClientFactory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8, "application/json"
            )
        };

        req.Headers.Accept.ParseAdd("application/vnd.github+json");
        req.Headers.UserAgent.ParseAdd("umbraco-proxy");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        req.Headers.Add("X-GitHub-Api-Version", "2022-11-28");

        HttpResponseMessage res;
        string? body;
        try
        {
            res = await client.SendAsync(req);
            body = await res.Content.ReadAsStringAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Rebuild frontend failed. {errorMessage}", ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }

        // succeeds, but does not return with 204 (no content)
        if (res.StatusCode != HttpStatusCode.NoContent)
        {
            _logger.LogError("Rebuild frontend failed with status code {StatusCode} and body {Body}", res.StatusCode, body);
            return StatusCode((int)res.StatusCode, body);
        }

        // workflow_dispatch returns 204 on success
        _logger.LogInformation("Webhook sent succesfully, starting rebuild of frontend at {url}", $"https://github.com/{repo}/actions");
        return NoContent();
    }
}
