namespace Utilities;

public class FormatConnectionString
{
    public static string Format(string uri, bool enablePooling = true, int minPoolSize = 10, int maxPoolSize = 100)
    {
        var uriBuilder = new UriBuilder(uri);

        var connectionString = $"Host={uriBuilder.Host};Username={uriBuilder.UserName};Password={uriBuilder.Password};Database={uriBuilder.Path.TrimStart('/')};";

        if (enablePooling)
        {
            connectionString += $"Pooling=true;MinPoolSize={minPoolSize};MaxPoolSize={maxPoolSize};";
        }
        else
        {
            connectionString += "Pooling=true;";
        }

        return connectionString;
    }
}