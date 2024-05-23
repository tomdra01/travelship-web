using System.Collections.Concurrent;
using Timer = System.Timers.Timer;

public class DebounceQueue
{
    private readonly ConcurrentDictionary<long, (Func<Task>, Timer)> _debounceQueue = new ConcurrentDictionary<long, (Func<Task>, Timer)>();
    private readonly int _debounceInterval;

    public DebounceQueue(int debounceInterval = 100)
    {
        _debounceInterval = debounceInterval;
    }

    public void Enqueue(long key, Func<Task> messageHandler)
    {
        if (_debounceQueue.TryGetValue(key, out var existingEntry))
        {
            existingEntry.Item2.Stop();
            existingEntry.Item2.Dispose();
        }

        var timer = new Timer(_debounceInterval);
        timer.Elapsed += async (sender, args) =>
        {
            timer.Stop();
            if (_debounceQueue.TryRemove(key, out var entry))
            {
                try
                {
                    await entry.Item1();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error processing debounced message: {ex.Message}");
                }
            }
            timer.Dispose();
        };

        _debounceQueue[key] = (messageHandler, timer);
        timer.Start();
    }
}