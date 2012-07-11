namespace TegudData.Interfaces.Repository
{
    public interface IContextFactory<T>
    {
        T Context { get; }
    }
}
