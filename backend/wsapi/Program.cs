using System.Reflection;
using System.Text.Json;
using dotenv.net;
using Fleck;
using Infrastructure.interfaces;
using lib;
using Repository;
using Service;
using Utilities;
using WebsocketApi;
using WebsocketApi.DTOs.Server;

var builder = WebApplication.CreateBuilder(args);

DotEnv.Load();

var dbConString = FormatConnectionString.Format(Configuration.DbCon);

builder.Services.AddSingleton<PinRepository>(provider => new PinRepository(dbConString));
builder.Services.AddSingleton<IPinService, PinService>();


var services = builder.FindAndInjectClientEventHandlers(Assembly.GetExecutingAssembly());

var app = builder.Build();
var server = new WebSocketServer("ws://0.0.0.0:8181");

server.Start(socket =>
{
    socket.OnOpen = () =>
    {
        Console.WriteLine("Open!");
        StateService.AddConnection(socket); 
    };
    socket.OnClose = () =>
    {
        Console.WriteLine("Close!");
        StateService.RemoveConnection(socket);  
    };
    socket.OnMessage = async message =>
    {
        try
        {
            await app.InvokeClientEventHandler(services, socket, message);
        }
        catch (Exception e)
        {
            Console.WriteLine("Caught Exception at wsapi/Program.cs: " + e.Message);
            socket.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "An error occurred: " + e.Message }));
        }

    };
});
Console.ReadLine();