using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToLeaveTripDto : BaseDto
{
    public int tripId { get; set; }
}