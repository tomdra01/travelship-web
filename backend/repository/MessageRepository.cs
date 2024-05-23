using Dapper;
using Npgsql;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Repository
{
    public class MessageRepository
    {
        private readonly NpgsqlConnection _connection;

        public MessageRepository(string connectionString)
        {
            _connection = new NpgsqlConnection(connectionString ?? throw new ArgumentNullException(nameof(connectionString)));
        }

        private async Task EnsureConnectionOpenAsync()
        {
            if (_connection.State != System.Data.ConnectionState.Open)
            {
                await _connection.OpenAsync();
            }
        }

        private async Task EnsureConnectionClosedAsync()
        {
            if (_connection.State != System.Data.ConnectionState.Closed)
            {
                await _connection.CloseAsync();
            }
        }

        public async Task<IEnumerable<Message>> GetMessagesByTripId(long tripId)
        {
            const string sql = "SELECT * FROM Production.messages WHERE tripid = @TripId;";

            await EnsureConnectionOpenAsync();
            var messages = await _connection.QueryAsync<Message>(sql, new { TripId = tripId });
            await EnsureConnectionClosedAsync();
            return messages;
        }

        public async Task<Message> AddMessage(Message message)
        {
            const string sql = @"
INSERT INTO Production.Messages (MessageContent, Username, TripId)
VALUES (@MessageContent, @Username, @TripId) RETURNING *;";

            await EnsureConnectionOpenAsync();
            var addedMessage = await _connection.QuerySingleAsync<Message>(sql, new {
                MessageContent = message.MessageContent,
                Username = message.Username,
                TripId = message.TripId
            });
            await EnsureConnectionClosedAsync();
            return addedMessage;
        }
    }
}
