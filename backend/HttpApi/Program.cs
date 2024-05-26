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
        builder =>
        {
            builder.WithOrigins("http://localhost:4200", "http://localhost:3000", "http://164.68.109.76")
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
        cspBuilder.AddDefaultSrc().Self().From("http://164.68.109.76 http://localhost:4200 http://localhost:3000");
    });
app.UseSecurityHeaders(policyCollection);

app.MapControllers();

app.Run();