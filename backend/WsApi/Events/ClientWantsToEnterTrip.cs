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
    private readonly IMessageService _messageService;

    public ClientWantsToEnterTrip(IPinService pinService, IMessageService messageService)
    {
        _pinService = pinService ?? throw new ArgumentNullException(nameof(pinService));
        _messageService = messageService ?? throw new ArgumentNullException(nameof(messageService));
    }

    public override async Task Handle(ClientWantsToEnterTripDto dto, IWebSocketConnection ws)
    {
        var isSuccess = StateService.AddToTrip(ws, dto.TripId);
        
        if (isSuccess)
        {
            var pins = await _pinService.GetPinsByTripId(dto.TripId);
            var messages = await _messageService.GetMessagesByTripId(dto.TripId);  // Now this should work without throwing null reference
            
            var response = new ServerAddsClientToTrip
            {
                message = "You have been added to trip " + dto.TripId,
                Pins = pins,
                Messages = messages
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