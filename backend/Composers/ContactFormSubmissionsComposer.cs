using backend.Notifications;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Notifications;

namespace backend.Composers;

public class ContactFormSubmissionsComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder) =>
        builder.AddNotificationAsyncHandler<UmbracoApplicationStartedNotification, EfCoreMigration>();
}
