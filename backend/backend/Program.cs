using Fleck;

class Program
{
    static void Main(string[] args)
    {
        var server = new WebSocketServer("ws://0.0.0.0:8181");
        server.Start(socket =>
        {
            socket.OnOpen = () => Console.WriteLine("Open!");
            socket.OnClose = () => Console.WriteLine("Close!");
            socket.OnMessage = message => socket.Send(message); 
        });

        Console.WriteLine("Server started on ws://0.0.0.0:8181");
        Console.ReadLine(); 
    }
}