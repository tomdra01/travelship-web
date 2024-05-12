using System.Text;
using dotenv.net;
using Infrastructure.interfaces;
using Service;
using Repository;
using Utilities;

var builder = WebApplication.CreateBuilder(args);

DotEnv.Load();

var dbConString = FormatConnectionString.Format(Configuration.DbCon);

builder.Services.AddSingleton<TripRepository>(provider =>
    new TripRepository(dbConString));
builder.Services.AddSingleton<ITripService, TripService>();

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
            builder.WithOrigins("http://localhost:4200", "http://localhost:3000", "http://localhost:5181", "http://localhost:8181")
            //builder.WithOrigins("deployed url here")
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
    .AddContentSecurityPolicy(builder =>
    {
        //builder.AddDefaultSrc().Self().From("deployed url here");
        builder.AddDefaultSrc().Self().From("http://localhost:4200, http://localhost:3000");
    });
app.UseSecurityHeaders(policyCollection);

app.MapControllers();

app.Run();
