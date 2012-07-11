using System;
using StackExchange.Profiling;

namespace TegudUtilities.Performance
{
    public class ProfilerWrapper : IProfilerWrapper
    {
        public IDisposable Step(string name)
        {
            return MiniProfiler.Current.Step(name);
        }
    }
}
