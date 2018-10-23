using System;
using Microsoft.EntityFrameworkCore;

namespace IotBbq.Model
{
    public class IotBbqContext : DbContext
    {
        public DbSet<BbqEvent> Events { get; set; }

        public DbSet<BbqItem> Items { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=bbq.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BbqItem>();
            modelBuilder.Entity<BbqEvent>().HasMany(e => e.Items).WithOne(i => i.BbqEvent);
        }
    }
}
