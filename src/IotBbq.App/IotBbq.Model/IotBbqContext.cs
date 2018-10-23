using System;
using Microsoft.EntityFrameworkCore;

namespace IotBbq.Model
{
    public class IotBbqContext : DbContext
    {
        public DbSet<BbqEvent> Events { get; set; }

        public DbSet<BbqModelItem> Items { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=bbq.db");
        }
    }
}
