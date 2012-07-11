namespace TegudData.ViewModels.Stuff
{
    public class StuffViewViewModel
    {
        public readonly string ID;
        public readonly string Name;
        public readonly bool IsCurrent;
        public string CurrentClass
        {
            get { return IsCurrent ? "enabled" : null; }
        }

        public StuffViewViewModel(string id, string name) : this(id, name, false) { }

        public StuffViewViewModel(string id, string name, bool isCurrent)
        {
            ID = id;
            Name = name;
            IsCurrent = isCurrent;
        }
    }
}
