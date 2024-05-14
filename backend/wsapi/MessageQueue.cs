using System.Collections.Concurrent;

namespace WebsocketApi;

public class MessageQueue
{
    private readonly ConcurrentQueue<Func<Task>> _messageQueue = new ConcurrentQueue<Func<Task>>();
    private bool _isProcessing;

    public void Enqueue(Func<Task> messageHandler)
    {
        _messageQueue.Enqueue(messageHandler);
        ProcessQueue();
    }

    private async void ProcessQueue()
    {
        if (_isProcessing) return;

        _isProcessing = true;
        while (_messageQueue.TryDequeue(out var messageHandler))
        {
            try
            {
                await messageHandler();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing message: {ex.Message}");
            }
        }
        _isProcessing = false;
    }
}