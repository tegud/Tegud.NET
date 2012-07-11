using System.Collections.Generic;

namespace TegudData.Parameters
{
    public class StuffParameters
    {
        public IEnumerable<string> Categories { get; set; }

        public string ViewId { get; set; }

        public string Name { get; set; }

        public StuffParameters()
        {
            Categories = new List<string>();
        }
    }
}