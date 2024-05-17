using System.Text.Json;
using Fleck;
using Infrastructure.interfaces;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToEditPinContent : BaseEventHandler<ClientWantsToEditPinContentDto>
    {
        private readonly IPinService _pinService;
        private static readonly MessageQueue _messageQueue = new MessageQueue();

        public ClientWantsToEditPinContent(IPinService pinService)
        {
            _pinService = pinService ?? throw new ArgumentNullException(nameof(pinService));
        }

        public override Task Handle(ClientWantsToEditPinContentDto dto, IWebSocketConnection ws)
        {
            if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
            {
                _messageQueue.Enqueue(async () =>
                {
                    try
                    {
                        var message = await ProcessPinEdit(dto, metaData.Username);
                        StateService.EditPin(dto.TripId, JsonSerializer.Serialize(message));
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error processing pin edit: {ex.Message}");
                        ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Failed to edit pin content" }));
                    }
                });
            }
            else
            {
                Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
                ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Connection not found" }));
            }

            return Task.CompletedTask;
        }

        private async Task<ServerEditsPinContentDto> ProcessPinEdit(ClientWantsToEditPinContentDto dto, string username)
        {
            var editedPin = await _pinService.EditPin(dto.PinId, dto.Description);

            return new ServerEditsPinContentDto
            {
                PinId = editedPin.PinId,
                Description = editedPin.Description,
                Username = username
            };
        }
        
    }