
namespace IotBbq.Web.Model
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using System;
    using System.Collections.Generic;
    using System.Text;

    public class LoggingContext: DbContext
    {
        public DbSet<BbqEvent> Events { get; set; }

        public DbSet<BbqItem> Items { get; set; }

        public DbSet<BbqItemLog> ItemLogs { get; set; }

        public DbSet<SmokerLog> SmokerLog { get; set; }

        public LoggingContext(DbContextOptions<LoggingContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BbqItemLog>();
            modelBuilder.Entity<SmokerLog>();
            modelBuilder.Entity<BbqItem>().HasMany(i => i.ItemLogs).WithOne(l => l.BbqItem);
            modelBuilder.Entity<BbqEvent>().HasMany(e => e.SmokerLogs).WithOne(l => l.Event);
            modelBuilder.Entity<BbqEvent>().HasMany(e => e.Items).WithOne(i => i.Event);
        }
    }
}
