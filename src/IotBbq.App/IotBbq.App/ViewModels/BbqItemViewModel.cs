﻿
namespace IotBbq.App.ViewModels
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using GalaSoft.MvvmLight;
    using IotBbq.App.Services;
    using IotBbq.Model;
    using MvvmValidation;

    public class BbqItemViewModel : ValidatingViewModel
    {
        private Guid id = Guid.NewGuid();

        private Guid bbqEventId;

        private string name;

        private string currentPhase;

        private double weight;

        private double targetTemperature;

        private int thermometerIndex;

        private DateTime? cookStartTime;

        private ItemDefinition definition;

        public BbqItemViewModel()
        {
            this.Validator.AddRule(nameof(this.Name), () => RuleResult.Assert(!string.IsNullOrEmpty(this.Name), "Name must be set"));

            this.Validator.AddRule(nameof(this.Definition), () =>
                RuleResult.Assert(this.Definition != null, "Item type must be selected!"));

            this.Validator.AddRule(nameof(this.ThermometerIndex), () =>
                RuleResult.Assert(this.ThermometerIndex > 0 && this.ThermometerIndex < 8, "Select a thermometer"));

            this.Validator.ResultChanged += (s, args) => this.RaisePropertyChanged(nameof(this.HasErrors));
        }

        public Guid Id
        {
            get => this.id;
            set => this.Set(() => this.Id, ref this.id, value);
        }

        public Guid BbqEventId
        {
            get => this.bbqEventId;
            set => this.Set(() => this.BbqEventId, ref this.bbqEventId, value);
        }

        public string Name
        {
            get => this.name;
            set => this.Set(() => this.Name, ref this.name, value);
        }

        public string CurrentPhase
        {
            get => this.currentPhase;
            set => this.Set(() => this.CurrentPhase, ref this.currentPhase, value);
        }

        public double Weight
        {
            get => this.weight;
            set => this.Set(() => this.Weight, ref this.weight, value);
        }

        public double TargetTemperature
        {
            get => this.targetTemperature;
            set => this.Set(() => this.TargetTemperature, ref this.targetTemperature, value);
        }

        public DateTime? CookStartTime
        {
            get => this.cookStartTime;
            set => this.Set(() => this.CookStartTime, ref this.cookStartTime, value);
        }

        public int ThermometerIndex
        {
            get => this.thermometerIndex;
            set => this.Set(() => this.ThermometerIndex, ref this.thermometerIndex, value);
        }

        public ItemDefinition Definition
        {
            get => this.definition;
            set => this.Set(() => this.Definition, ref this.definition, value);
        }

        public void RaiseCookStartTimeChanged()
        {
            this.RaisePropertyChanged(() => this.CookStartTime);
        }

        public void Load(BbqItem item)
        {
            this.Id = item.Id;
            this.BbqEventId = item.BbqEventId;
            this.Name = item.Name;
            this.CurrentPhase = item.CurrentPhase;
            this.Weight = item.Weight;
            this.TargetTemperature = item.TargetTemperature;
            this.CookStartTime = item.CookStartTime;
            this.ThermometerIndex = item.ThermometerIndex;

            // Search for definition by ItemType
            this.Definition = ItemDefinition.GetDefinitions().First(d => d.ItemType == item.ItemType);
        }

        public void Load(BbqItemViewModel item)
        {
            this.Id = item.Id;
            this.BbqEventId = item.BbqEventId;
            this.Name = item.Name;
            this.CurrentPhase = item.CurrentPhase;
            this.Weight = item.Weight;
            this.TargetTemperature = item.TargetTemperature;
            this.CookStartTime = item.CookStartTime;
            this.Definition = item.Definition;
            this.ThermometerIndex = item.ThermometerIndex;
        }
    }
}
