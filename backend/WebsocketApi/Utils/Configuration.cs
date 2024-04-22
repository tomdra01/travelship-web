namespace ClipTok.Utils;

public static class Configuration
{
    public static readonly string DbCon = GetEnvironmentVariable("DATABASE_CONNECTION_STRING");
    
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