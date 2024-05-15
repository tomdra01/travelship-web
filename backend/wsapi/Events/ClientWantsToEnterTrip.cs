using System.Text.Json;
using Fleck;
using Infrastructure.interfaces;
using lib;
using Repository.Models;

namespace WebsocketApi.Events;

public class ClientWantsToEnterTripDto : BaseDto
{
    public int TripId { get; set; }
}

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

            // Print each pin's details to the console
            foreach (var pin in pins)
            {
                Console.WriteLine($"PinId: {pin.PinId}, Type: {pin.Type}, Title: {pin.Title}, Description: {pin.Description}, XPosition: {pin.XPosition}, YPosition: {pin.YPosition}, TripId: {pin.TripId}");
            }

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

public class ServerAddsClientToTrip : BaseDto
{
    public string message { get; set; }
    public IEnumerable<Pin> Pins { get; set; }
}