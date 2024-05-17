namespace Utilities;

public static class Configuration
{
    public static readonly string DbCon = GetEnvironmentVariable("DB_CON");
    public static readonly string UnsplashKey = GetEnvironmentVariable("UNSPLASH_KEY");
    public static readonly string RapidApiKey = GetEnvironmentVariable("RAPIDAPI_KEY");
    
    private static string GetEnvironmentVariable(string name)
    {
        string value = Environment.GetEnvironmentVariable(name)!;
        if (value == null)
        {
            throw new InvalidOperationException($"Environment variable '{name}' is not set.");
        }
        return value;
    }
}