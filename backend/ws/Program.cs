using System.Reflection;
using System.Text.Json;
using Fleck;
using lib;
using WebsocketApi;
using WebsocketApi.DTOs.Server;

var builder = WebApplication.CreateBuilder(args);

// STEP 1: ADD THIS LINE
var services = builder.FindAndInjectClientEventHandlers(Assembly.GetExecutingAssembly());

var app = builder.Build();
var server = new WebSocketServer("ws://0.0.0.0:8181");

var allSockets = new List<IWebSocketConnection>();

server.Start(socket =>
{
    socket.OnOpen = () =>
    {
        Console.WriteLine("Open!");
        StateService.AddConnection(socket);  // Ensure connection is added
        allSockets.Add(socket);
    };
    socket.OnClose = () =>
    {
        Console.WriteLine("Close!");
        StateService.RemoveConnection(socket);  // Remove connection on close
        allSockets.Remove(socket);
    };
    socket.OnMessage = async message =>
    {
        try
        {
            // Invoke the event handler
            await app.InvokeClientEventHandler(services, socket, message);
        }
        catch (Exception e)
        {
            Console.WriteLine("Caught Exception at ws/Program.cs: " + e.Message);
            socket.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClient { errorMessage = "An error occurred: " + e.Message }));
        }

    };
});
Console.ReadLine();