using Fleck;


namespace WebsocketApi;

public class WsWithMetaData
{
    public IWebSocketConnection Connection { get; set; }
    public string Username { get; set; }

    public WsWithMetaData(IWebSocketConnection connection)
    {
        Connection = connection;
    }
}

public static class StateService
{
    public static Dictionary<Guid, WsWithMetaData> Connections = new();
    public static Dictionary<int, HashSet<Guid>> Rooms = new();
    public static Dictionary<int, Queue<string>> RoomMessages = new();


    public static bool AddConnection(IWebSocketConnection ws)
    {
        return Connections.TryAdd(ws.ConnectionInfo.Id, new WsWithMetaData(ws));
    }
    
    public static bool RemoveConnection(IWebSocketConnection ws)
    {
        return Connections.Remove(ws.ConnectionInfo.Id);
    }

    public static bool AddToRoom(IWebSocketConnection ws, int room)
    {
        if (!Rooms.ContainsKey(room))
            Rooms.Add(room, new HashSet<Guid>());
        return Rooms[room].Add(ws.ConnectionInfo.Id);
    }
    
    public static bool RemoveFromRoom(IWebSocketConnection ws, int room)
    {
        if (Rooms.TryGetValue(room, out var guids))
            return guids.Remove(ws.ConnectionInfo.Id);
        return false;
    }
    
    
    public static void BroadcastToRoom(int room, string message)
    {
        if (!RoomMessages.ContainsKey(room))
        {
            RoomMessages.Add(room, new Queue<string>());
        }

        var messagesQueue = RoomMessages[room];
        if (messagesQueue.Count >= 15)
        {
            messagesQueue.Dequeue(); // Remove the oldest message if we have 15 messages already
        }
        messagesQueue.Enqueue(message); 

        if (Rooms.TryGetValue(room, out var guids))
        {
            foreach (var guid in guids)
            {
                if (Connections.TryGetValue(guid, out var ws))
                {
                    ws.Connection.Send(message);
                }
            }
        }
    }
    
    public static void MovePin(int roomId, string jsonMessage)
    {
        if (Rooms.TryGetValue(roomId, out var guids))
        {
            foreach (var guid in guids)
            {
                if (Connections.TryGetValue(guid, out var ws))
                {
                    ws.Connection.Send(jsonMessage);
                }
            }
        }
    }
    
    public static void ScalePin(int roomId, string jsonMessage)
    {
        if (Rooms.TryGetValue(roomId, out var guids))
        {
            foreach (var guid in guids)
            {
                if (Connections.TryGetValue(guid, out var ws))
                {
                    ws.Connection.Send(jsonMessage);
                }
            }
        }
    }
    
    public static void AddPin(int roomId, string jsonMessage)
    {
        if (Rooms.TryGetValue(roomId, out var guids))
        {
            foreach (var guid in guids)
            {
                if (Connections.TryGetValue(guid, out var ws))
                {
                    ws.Connection.Send(jsonMessage);
                }
            }
        }
    }
}