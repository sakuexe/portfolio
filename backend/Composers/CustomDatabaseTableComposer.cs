using backend.Notifications;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Notifications;

namespace backend.Composers;

public class CustomDatabaseTableComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.AddNotificationAsyncHandler<UmbracoApplicationStartingNotification, RunContactFormSubmissionsMigration>();
    }
}
