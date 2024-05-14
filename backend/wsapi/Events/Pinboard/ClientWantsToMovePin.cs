using System.Text.Json;
using Fleck;
using Infrastructure.interfaces;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;
using Repository.Models;
using System.Threading;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToMovePin : BaseEventHandler<ClientWantsToMovePinDto>
    {
        private readonly IPinService _pinService;
        private static readonly MessageQueue _messageQueue = new MessageQueue();

        public ClientWantsToMovePin(IPinService pinService)
        {
            _pinService = pinService ?? throw new ArgumentNullException(nameof(pinService));
        }

        public override Task Handle(ClientWantsToMovePinDto dto, IWebSocketConnection ws)
        {
            if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
            {
                _messageQueue.Enqueue(async () =>
                {
                    try
                    {
                        var message = await ProcessPinMove(dto, metaData.Username);
                        StateService.MovePin(dto.TripId, JsonSerializer.Serialize(message));
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error processing pin move: {ex.Message}");
                        ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Failed to move pin" }));
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

        private async Task<ServerMovesPinDto> ProcessPinMove(ClientWantsToMovePinDto dto, string username)
        {
            var movedPin = await _pinService.MovePin(dto.PinId, dto.XPosition, dto.YPosition);

            return new ServerMovesPinDto
            {
                PinId = movedPin.PinId,
                XPosition = movedPin.XPosition,
                YPosition = movedPin.YPosition,
                Username = username
            };
        }
    }