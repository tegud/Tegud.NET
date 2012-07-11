using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TegudData.Models.Stuff;
using TegudData.Repository.Stuff;

namespace TegudData.ViewModels.Stuff
{
    public class StuffItemViewModel
    {
        public int Id { get; private set; }

        public string Name { get; private set; }

        public string LentTo { get; private set; }

        public string DateAdded { get; private set; }

        public StuffCategoryViewModel StuffCategory { get; private set; }

        public StuffItemViewModel(StuffItem stuffItem)
        {
            Id = stuffItem.Id;
            Name = stuffItem.Name;
            LentTo = stuffItem.LentTo ?? string.Empty;
            DateAdded = stuffItem.Added.ToString("dd MMM yyyy");
            StuffCategory = new StuffCategoryViewModel(stuffItem.StuffCategory);
        }
    }
}
