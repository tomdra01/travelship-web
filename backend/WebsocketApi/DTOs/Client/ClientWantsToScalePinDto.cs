using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToScalePinDto : BaseDto
{
    public int PinId { get; set; }
    public double ScaleX { get; set; }
    public double ScaleY { get; set; }
    public int RoomId { get; set; }
}