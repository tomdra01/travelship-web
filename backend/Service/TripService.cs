using Repository;
using Repository.Models;

namespace Service;

public class TripService : ITripService
    {
        private readonly TripRepository _tripRepository;

        public TripService(TripRepository tripRepository)
        {
            _tripRepository = tripRepository ?? throw new ArgumentNullException(nameof(tripRepository), "TripRepository is null");
        }

        public async Task<Trip> CreateTrip(Trip trip)
        {
            if (trip == null)
            {
                throw new ArgumentNullException(nameof(trip), "Trip data is null");
            }

            if (string.IsNullOrEmpty(trip.Name))
            {
                throw new ArgumentException("Trip name must be provided", nameof(trip.Name));
            }

            if (string.IsNullOrEmpty(trip.Location))
            {
                throw new ArgumentException("Location must be provided", nameof(trip.Location));
            }

            if (trip.Date == default)
            {
                throw new ArgumentException("Valid trip date must be provided", nameof(trip.Date));
            }

            try
            {
                return await _tripRepository.CreateTrip(trip);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"An error occurred while creating a trip: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Trip>> GetAllTrips()
        {
            try
            {
                return await _tripRepository.GetAllTrips();
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while trying to get all trips.", ex);
            }
        }
        
        public async Task<IEnumerable<Trip>> GetPublicTrips()
        {
            try
            {
                return await _tripRepository.GetPublicTrips();
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while trying to get all PUBLIC trips.", ex);
            }
        }

        public async Task<Trip> GetTripById(int id)
        {
            try
            {
                var trip = await _tripRepository.GetTripById(id);
                if (trip == null) throw new KeyNotFoundException("Trip not found");
                return trip;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception)
            {
                throw new Exception("Could not get the trip by ID");
            }
        }
        
        public async Task<Trip> GetTripByCode(string code)
        {
            // This method should interact with the repository to fetch a trip by its code.
            return await _tripRepository.GetTripByCode(code);
        }

        public async Task<Trip> UpdateTrip(Trip trip)
        {
            if (trip == null)
            {
                throw new ArgumentNullException(nameof(trip), "Update information is null");
            }

            try
            {
                var updatedTrip = await _tripRepository.UpdateTrip(trip);
                if (updatedTrip == null) throw new KeyNotFoundException("Trip not found");

                return updatedTrip;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception)
            {
                throw new Exception("Could not update the trip");
            }
        }

        public async Task<bool> DeleteTrip(int id)
        {
            try
            {
                return await _tripRepository.DeleteTrip(id);
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception)
            {
                throw new Exception("Could not delete the trip");
            }
        }
    }