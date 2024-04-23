namespace HttpApi.Utils;

public static class Configuration
{
    public static readonly string DbCon = GetEnvironmentVariable("DB_CON");
    public static readonly string DbPassword = GetEnvironmentVariable("DATABASE_PASSWORD");
    public static readonly string DbName = GetEnvironmentVariable("DATABASE_USER");

    
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