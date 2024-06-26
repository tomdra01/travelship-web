using dotenv.net;
using Infrastructure.interfaces;
using Repository;
using Service;
using Utilities;

var builder = WebApplication.CreateBuilder(args);

DotEnv.Load();

var dbConString = FormatConnectionString.Format(Configuration.DbCon);

builder.Services.AddSingleton<TripRepository>(provider =>
    new TripRepository(dbConString));
builder.Services.AddSingleton<ITripService, TripService>();


builder.Services.AddHttpClient();

builder.Services.AddOptions();
builder.Services.AddMemoryCache();

builder.Services.AddNpgsqlDataSource(dbConString,
    dataSourceBuilder => dataSourceBuilder.EnableParameterLogging());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("SpecificOriginsPolicy",
        policyBuilder =>
        {
            policyBuilder.WithOrigins(
                    "http://localhost:4200",
                    "http://164.68.109.76",
                    "http://164.68.109.76:80",
                    "http://travelship.net",
                    "http://167.86.96.91",
                    "http://167.86.96.91:80")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

var app = builder.Build();

app.UseCors("SpecificOriginsPolicy");

app.UseSwagger();
app.UseSwaggerUI();

var policyCollection = new HeaderPolicyCollection()
    .AddDefaultSecurityHeaders()
    .AddContentSecurityPolicy(cspBuilder =>
    {
        cspBuilder.AddDefaultSrc().Self()
            .From("http://164.68.109.76")
            .From("http://167.86.96.91")
            .From("http://travelship.net")
            .From("http://localhost:4200");
    });
app.UseSecurityHeaders(policyCollection);

app.MapControllers();

app.Run();