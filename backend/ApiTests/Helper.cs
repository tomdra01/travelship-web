using Dapper;
using dotenv.net;
using Utilities;
using Npgsql;

namespace ApiTests;

public static class Helper
{
    public static readonly NpgsqlDataSource DataSource;
    public static readonly string ClientBaseUrl = "http://localhost:4200/";
    public static readonly string ApiBaseUrl = "http://localhost:5181/api";

    static Helper()
    {
        var rawConnectionString = "postgres://jiddccrd:dStoIch-khgauAEnetRDOCnLyNg_8Km8@cornelius.db.elephantsql.com/jiddccrd";
        if (rawConnectionString == null)
        {
            throw new Exception("Connection string is empty.");
        }

        try
        {
            var uri = new Uri(rawConnectionString);
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
    
    public static NpgsqlConnection GetOpenConnection()
    {
        var connectionString = "Host=localhost;Database=mydb;Username=myuser;Password=mypass;";
        return new NpgsqlConnection(connectionString);
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
DROP TABLE IF EXISTS test.trips CASCADE;
CREATE TABLE test.trips (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    price DECIMAL NOT NULL,
    description VARCHAR(500) NOT NULL,
    imageurl VARCHAR(2083) NULL
);";
}