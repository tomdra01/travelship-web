using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToMovePinDto : BaseDto
{
    public int PinId { get; set; }
    public int XPosition { get; set; }
    public int YPosition { get; set; }
    public int RoomId { get; set; }
}