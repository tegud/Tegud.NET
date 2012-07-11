using System;

namespace TegudData.Models.Stuff
{
    public class StuffItem
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string LentTo { get; set; }

        public DateTime Added { get; set; }

        public StuffCategory StuffCategory { get; set; }
    }
}