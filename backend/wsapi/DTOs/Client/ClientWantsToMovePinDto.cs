using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToMovePinDto : BaseDto
{
    public long PinId { get; set; }
    public int XPosition { get; set; }
    public int YPosition { get; set; }
    public int TripId { get; set; }
}