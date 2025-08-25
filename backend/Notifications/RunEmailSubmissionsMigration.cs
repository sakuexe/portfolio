using Microsoft.EntityFrameworkCore;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;

namespace backend.Notifications;

// https://docs.umbraco.com/umbraco-cms/tutorials/getting-started-with-entity-framework-core
public sealed class RunEmailSubmissionsMigration(
    DatabaseContext databaseContext
) : INotificationAsyncHandler<UmbracoApplicationStartedNotification>
{
    private readonly DatabaseContext _databaseContext = databaseContext;

    public async Task HandleAsync(
        UmbracoApplicationStartedNotification notification, 
        CancellationToken cancellationToken
    )
    {
        IEnumerable<string> pendingMigrations = await _databaseContext.Database.GetPendingMigrationsAsync(cancellationToken);

        if (!pendingMigrations.Any())
            return;

        await _databaseContext.Database.MigrateAsync(cancellationToken);
    }
}
