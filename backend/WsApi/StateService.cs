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
    public static Dictionary<int, HashSet<Guid>> Trips = new();
    public static Dictionary<int, Queue<string>> TripMessages = new();


    public static bool AddConnection(IWebSocketConnection ws)
    {
        return Connections.TryAdd(ws.ConnectionInfo.Id, new WsWithMetaData(ws));
    }
    
    public static bool RemoveConnection(IWebSocketConnection ws)
    {
        return Connections.Remove(ws.ConnectionInfo.Id);
    }

    public static bool AddToTrip(IWebSocketConnection ws, int tripId)
    {
        if (!Trips.ContainsKey(tripId))
            Trips.Add(tripId, new HashSet<Guid>());
        return Trips[tripId].Add(ws.ConnectionInfo.Id);
    }
    
    public static bool RemoveFromTrip(IWebSocketConnection ws, int tripId)
    {
        if (Trips.TryGetValue(tripId, out var guids))
            return guids.Remove(ws.ConnectionInfo.Id);
        return false;
    }
    
    
    public static void BroadcastToTrip(int trip, string message)
    {
        if (!TripMessages.ContainsKey(trip))
        {
            TripMessages.Add(trip, new Queue<string>());
        }

        var messagesQueue = TripMessages[trip];
        if (messagesQueue.Count >= 15)
        {
            messagesQueue.Dequeue();
        }
        messagesQueue.Enqueue(message); 

        if (Trips.TryGetValue(trip, out var guids))
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
    
    public static void AddPin(int tripId, string jsonMessage)
    {
        if (Trips.TryGetValue(tripId, out var guids))
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
    
    public static void DeletePin(int tripId, string jsonMessage)
    {
        if (Trips.TryGetValue(tripId, out var guids))
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
    
    public static void MovePin(int tripId, string jsonMessage)
    {
        if (Trips.TryGetValue(tripId, out var guids))
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
    
    public static void EditPin(int tripId, string jsonMessage)
    {
        if (Trips.TryGetValue(tripId, out var guids))
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