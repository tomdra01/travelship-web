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
builder.Services.AddSingleton<MessageRepository>(provider => new MessageRepository(dbConString));
builder.Services.AddSingleton<IMessageService, MessageService>();

var services = builder.FindAndInjectClientEventHandlers(Assembly.GetExecutingAssembly());

var app = builder.Build();
var server = new WebSocketServer("ws://0.0.0.0:8181");

server.Start(socket =>
{
    socket.OnOpen = () =>
    {
        Console.WriteLine("Open socket! ID: " + socket.ConnectionInfo.Id + " IP: " + socket.ConnectionInfo.ClientIpAddress );
        StateService.AddConnection(socket); 
    };
    socket.OnClose = () =>
    {
        Console.WriteLine("Close socket! ID: " + socket.ConnectionInfo.Id + " IP: " + socket.ConnectionInfo.ClientIpAddress );
        StateService.RemoveConnection(socket);  
    };
    socket.OnMessage = async message =>
    {
        try
        {
            await app.InvokeClientEventHandler(services, socket, message);
        }
        catch (JsonException jsonEx)
        {
            Console.WriteLine($"JSON Error at WsApi/Program.cs: {jsonEx.Message} - Raw Message: {message}");
            socket.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Invalid JSON format: " + jsonEx.Message }));
        }
        catch (Exception e)
        {
            Console.WriteLine("Caught Exception at WsApi/Program.cs: " + e.Message);
            socket.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "An error occurred: " + e.Message }));
        }
    };
});
Console.ReadLine();
