using Dapper;
using Npgsql;

namespace ApiTests;

public static class Helper
{
    public static readonly NpgsqlDataSource DataSource;
    public static readonly string ClientBaseUrl = "http://localhost:4200/";
    public static readonly string ApiBaseUrl = "http://localhost:5181/api";

    static Helper()
    {
        var envVarKeyName = "pgconn";
        ///var connectionString = Environment.GetEnvironmentVariable("DB_CON");
        var connectionString = "postgres://jiddccrd:dStoIch-khgauAEnetRDOCnLyNg_8Km8@cornelius.db.elephantsql.com/jiddccrd";
        if (connectionString == null)
        {
            throw new Exception("Connection string environment variable 'pgconn' is empty.");
        }

        try
        {
            var uri = new Uri(connectionString);
            var properlyFormattedConnectionString = string.Format(
                "Server={0};Database={1};User Id={2};Password={3};Port={4};Pooling=true;MaxPoolSize=6;",
                uri.Host,
                uri.AbsolutePath.Trim('/'),
                uri.UserInfo.Split(':')[0],
                uri.UserInfo.Split(':')[1],
                uri.Port > 0 ? uri.Port : 5432);
            DataSource = new NpgsqlDataSourceBuilder(properlyFormattedConnectionString).Build();
            DataSource.OpenConnection().Close();
        }
        catch (Exception e)
        {
            throw new Exception("Connection string is found but could not be used.", e);
        }
    }
    
    public static void TriggerRebuild()
    {
        using (var conn = DataSource.OpenConnection())
        {
            try
            {
                conn.Execute(RebuildScript);
            }
            catch (Exception e)
            {
                throw new Exception("There was an error rebuilding the database.", e);
            }
        }
    }


    public static string RebuildScript = @"
        DROP TABLE IF EXISTS Test.trips CASCADE;
        
        CREATE TABLE Test.trips (
            id           serial PRIMARY KEY,
            name         varchar(255) NOT NULL,
            location     varchar(255) NOT NULL,
            date         date NOT NULL,
            description  text,
            peoplejoined integer NOT NULL DEFAULT 0,
            code         varchar(10) CONSTRAINT unique_trip_code UNIQUE
        );
        ";
    
}