using Infrastructure.interfaces;
using Repository;
using Repository.Models;

namespace Service;

public class PinService : IPinService
{
    private readonly PinRepository _pinRepository;

    public PinService(PinRepository pinRepository)
    {
        _pinRepository = pinRepository ?? throw new ArgumentNullException(nameof(pinRepository), "PinRepository is null");
    }
    
    public async Task<IEnumerable<Pin>> GetPinsByTripId(long tripId)
    {
        try
        {
            return await _pinRepository.GetPinsByTripId(tripId);
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while retrieving pins for trip ID {tripId}: {ex.Message}", ex);
        }
    }

    public async Task<Pin> AddPin(Pin pin)
    {
        if (pin == null)
        {
            throw new ArgumentNullException(nameof(pin), "Pin data is null");
        }

        try
        {
            return await _pinRepository.AddPin(pin);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"An error occurred while adding a pin: {ex.Message}", ex);
        }
    }

    public async Task<bool> DeletePin(long pinId)
    {
        try
        {
            return await _pinRepository.RemovePin(pinId);
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while removing the pin: {ex.Message}", ex);
        }
    }

    public async Task<Pin> MovePin(long pinId, int newX, int newY)
    {
        try
        {
            return await _pinRepository.MovePin(pinId, newX, newY);
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while moving the pin: {ex.Message}", ex);
        }
    }

    public Task<Pin> EditPin(long pinId, string newDescription)
    {
        try
        {
            return _pinRepository.EditPin(pinId, newDescription);
        }
        catch (Exception e)
        {
            throw new Exception($"An error occurred while editing the pin: {e.Message}", e);
        }
    }
}