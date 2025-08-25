using NPoco;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace backend.Notifications;

public class RunContactFormSubmissionsMigration : INotificationAsyncHandler<UmbracoApplicationStartingNotification>
{
    private readonly ILogger<RunContactFormSubmissionsMigration> _logger;
    private readonly IMigrationPlanExecutor _migrationPlanExecutor;
    private readonly ICoreScopeProvider _coreScopeProvider;
    private readonly IKeyValueService _keyValueService;
    private readonly IRuntimeState _runtimeState;

    public RunContactFormSubmissionsMigration(
        ILogger<RunContactFormSubmissionsMigration> logger,
        ICoreScopeProvider coreScopeProvider,
        IMigrationPlanExecutor migrationPlanExecutor,
        IKeyValueService keyValueService,
        IRuntimeState runtimeState)
    {
        _logger = logger;
        _migrationPlanExecutor = migrationPlanExecutor;
        _coreScopeProvider = coreScopeProvider;
        _keyValueService = keyValueService;
        _runtimeState = runtimeState;
    }

    public async Task HandleAsync(UmbracoApplicationStartingNotification notification, CancellationToken ct)
    {
        if (_runtimeState.Level < RuntimeLevel.Run)
        {
            return;
        }

        // Create a migration plan for a specific project/feature
        // We can then track that latest migration state/step for this project/feature
        var migrationPlan = new MigrationPlan("ContactFormSubmissions");

        // This is the steps we need to take
        // Each step in the migration adds a unique value
        migrationPlan.From(string.Empty)
            .To<AddContactFormSubmissionTable>("contactformsubmission-db");

        // Go and upgrade our site (Will check if it needs to do the work or not)
        // Based on the current/latest step
        var upgrader = new Upgrader(migrationPlan);
        await upgrader.ExecuteAsync(
            _migrationPlanExecutor,
            _coreScopeProvider,
            _keyValueService);
    }
}

// Migration and schema defined as in the previous code sample.
public class AddContactFormSubmissionTable : AsyncMigrationBase
{
    public AddContactFormSubmissionTable(IMigrationContext context) : base(context)
    {
    }

    protected override Task MigrateAsync()
    {
        Logger.LogInformation("Running migration {MigrationStep}", nameof(AddContactFormSubmissionTable));

        // Lots of methods available in the MigrationBase class - discover with this.
        if (TableExists(ContactFormSubmissionSchema.TableName) == false)
        {
            Create.Table<ContactFormSubmissionSchema>().Do();
        }
        else
        {
            Logger.LogInformation("The database table {DbTable} already exists, skipping", ContactFormSubmissionSchema.TableName);
        }

        return Task.CompletedTask;
    }

    [TableName("ContactFormSubmission")]
    [PrimaryKey("Id", AutoIncrement = true)]
    [ExplicitColumns]
    public class ContactFormSubmissionSchema
    {
        public const string TableName = "ContactFormSubmission";

        [PrimaryKeyColumn(AutoIncrement = true, IdentitySeed = 1)]
        [Column("Id")]
        public int Id { get; set; }

        [Column("Name")]
        public required string Name { get; set; }

        [Column("Email")]
        public required string Email { get; set; }

        [Column("Subject")]
        public string? Subject { get; set; }

        [Column("Message")]
        [SpecialDbType(SpecialDbTypes.NVARCHARMAX)]
        public required string Message { get; set; }

        [Column("CreatedUtc")]
        public required DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
    }
}
