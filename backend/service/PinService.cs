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
}