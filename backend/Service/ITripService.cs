using Repository.Models;

namespace Service;

public interface ITripService
{
        Task<Trip> CreateTrip(Trip trip);
        Task<IEnumerable<Trip>> GetAllTrips();
        Task<IEnumerable<Trip>> GetPublicTrips();
        Task<Trip> GetTripById(int id);
        Task<Trip> GetTripByCode(string code);
        Task<Trip> UpdateTrip(Trip trip);
        Task<bool> DeleteTrip(int id);
    
}