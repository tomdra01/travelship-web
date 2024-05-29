using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToBroadcastToTripDto : BaseDto
{
    public int tripId { get; set; }
    public string message { get; set; }
}