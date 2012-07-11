using System;

namespace TegudUtilities.Performance
{
    public interface IProfilerWrapper
    {
        IDisposable Step(string name);
    }
}