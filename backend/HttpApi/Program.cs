using System.Text;
using ClipTok.Utils;
using Infrastructure;
using Repository;

var builder = WebApplication.CreateBuilder(args);


var jwtKey = builder.Configuration["JWT_Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT key is not set in configuration.");
}
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddSingleton<TripRepository>();
builder.Services.AddSingleton<ITripService>();
builder.Services.AddSingleton<TripService>();

builder.Services.AddOptions();
builder.Services.AddMemoryCache();

builder.Services.AddNpgsqlDataSource(Configuration.DbCon,
    dataSourceBuilder => dataSourceBuilder.EnableParameterLogging());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("SpecificOriginsPolicy",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200", "http://localhost:3000")
            //builder.WithOrigins("https://craftburger-2fe56.firebaseapp.com")
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
        //builder.AddDefaultSrc().Self().From("https://craftburger-2fe56.firebaseapp.com");
        builder.AddDefaultSrc().Self().From("http://localhost:4200, http://localhost:3000");
    });
app.UseSecurityHeaders(policyCollection);

app.MapControllers();

app.Run();
