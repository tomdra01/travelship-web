using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToAddPinDto : BaseDto
{
    public int PinId { get; set; }
    public double XPosition { get; set; }
    public double YPosition { get; set; }
    public int RoomId { get; set; }
}
