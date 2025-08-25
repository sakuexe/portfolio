using Umbraco.Cms.Core.Composing;

namespace backend.Composers;

public class EFCoreComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddUmbracoDbContext<DatabaseContext>((sp, options) => 
        {
            options.UseUmbracoDatabaseProvider(sp);
        });
    }
}
