﻿// <auto-generated />
using System;
using IotBbq.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace IotBbq.Model.Migrations
{
    [DbContext(typeof(IotBbqContext))]
    partial class IotBbqContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024");

            modelBuilder.Entity("IotBbq.Model.BbqEvent", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("EventDate");

                    b.Property<string>("EventName");

                    b.Property<DateTime>("TurnInTime");

                    b.HasKey("Id");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("IotBbq.Model.BbqItem", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("BbqEventId");

                    b.Property<DateTime?>("CookStartTime");

                    b.Property<string>("CurrentPhase");

                    b.Property<string>("ItemType");

                    b.Property<string>("Name");

                    b.Property<double>("TargetTemperature");

                    b.Property<double>("Weight");

                    b.HasKey("Id");

                    b.HasIndex("BbqEventId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("IotBbq.Model.BbqItem", b =>
                {
                    b.HasOne("IotBbq.Model.BbqEvent", "BbqEvent")
                        .WithMany("Items")
                        .HasForeignKey("BbqEventId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
