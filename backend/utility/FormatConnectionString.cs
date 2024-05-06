namespace Utilities;

public class FormatConnectionString
{
    public static string Format(string uri)
    {
        var uriBuilder = new UriBuilder(uri);
        return $"Host={uriBuilder.Host};Username={uriBuilder.UserName};Password={uriBuilder.Password};Database={uriBuilder.Path.TrimStart('/')};";
    }
    
}