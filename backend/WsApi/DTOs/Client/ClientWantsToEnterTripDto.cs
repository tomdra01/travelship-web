using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToEnterTripDto : BaseDto
{
    public int TripId { get; set; }
}