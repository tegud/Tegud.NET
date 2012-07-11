using System.Collections.Generic;
using System.Linq;

namespace TegudData.Models.Blog
{
    public class TagCloud
    {
        public readonly IEnumerable<TagCloudItem> Items;

        public readonly int TotalItems;

        public TagCloud(IEnumerable<TagCloudItem> items)
        {
            Items = items;
            TotalItems = items.Sum(i => i.Items);
        }
    }
}