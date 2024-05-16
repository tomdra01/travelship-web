using System.Text.Json;
using Fleck;
using Infrastructure.interfaces;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events;

public class ClientWantsToEnterTrip : BaseEventHandler<ClientWantsToEnterTripDto>
{
    private readonly IPinService _pinService;

    public ClientWantsToEnterTrip(IPinService pinService)
    {
        _pinService = pinService ?? throw new ArgumentNullException(nameof(pinService));
    }

    public override async Task Handle(ClientWantsToEnterTripDto dto, IWebSocketConnection ws)
    {
        var isSuccess = StateService.AddToTrip(ws, dto.TripId);
        
        if (isSuccess)
        {
            var pins = await _pinService.GetPinsByTripId(dto.TripId);
            
            var response = new ServerAddsClientToTrip
            {
                message = "You have been added to trip " + dto.TripId,
                Pins = pins
            };

            ws.Send(JsonSerializer.Serialize(response));
        }
        else
        {
            var errorResponse = new ServerAddsClientToTrip
            {
                message = "Failed to add you to trip " + dto.TripId
            };

            ws.Send(JsonSerializer.Serialize(errorResponse));
        }
    }
}