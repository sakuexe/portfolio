namespace backend.Notifications;

using Microsoft.AspNetCore.SignalR;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;

public class NotificationsHub : Hub { };

public class ContentPublishedHandler(
    IHubContext<NotificationsHub> hub
) : INotificationAsyncHandler<ContentPublishedNotification>
{
    private readonly IHubContext<NotificationsHub> _hub = hub;

    public async Task HandleAsync(ContentPublishedNotification notification, CancellationToken ct)
    {
        var items = notification.PublishedEntities.Select(e => new
        {
            Id = e.Id,
            Key = e.Key,
            Name = e.Name,
            ContentType = e.ContentType.Alias
        });

        await _hub.Clients.All.SendAsync("contentPublished", items, ct);
    }
}

