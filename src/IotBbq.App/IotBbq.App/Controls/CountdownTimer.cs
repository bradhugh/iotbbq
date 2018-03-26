
namespace IotBbq.App.Controls
{
    using System;
    using Windows.UI.Xaml;
    using Windows.UI.Xaml.Controls;

    public sealed class CountdownTimer : Control
    {
        #region Dependency Properties
        public static DependencyProperty DueTimeProperty = DependencyProperty.Register(
            "DueTime",
            typeof(DateTime?),
            typeof(CountdownTimer),
            null);

        public static DependencyProperty LabelProperty = DependencyProperty.Register(
            "Label",
            typeof(string),
            typeof(CountdownTimer),
            new PropertyMetadata(string.Empty, OnLabelChanged));

        public static DependencyProperty TimerEnabledProperty = DependencyProperty.Register(
            "TimerEnabled",
            typeof(bool),
            typeof(CountdownTimer),
            new PropertyMetadata(false, OnTimerEnabledChanged));
        #endregion

        private DispatcherTimer timer = new DispatcherTimer();

        private TextBlock countdownTextBlock;

        private TextBlock countdownLabel;

        public CountdownTimer()
        {
            this.DefaultStyleKey = typeof(CountdownTimer);
            this.timer.Interval = TimeSpan.FromSeconds(1);

            this.timer.Tick += this.Timer_Tick;

            if (this.TimerEnabled)
            {
                this.EnableTimer();
            }
        }

        #region Properties
        public DateTime? DueTime
        {
            get { return (DateTime?)this.GetValue(DueTimeProperty); }
            set { this.SetValue(DueTimeProperty, value); }
        }

        public string Label
        {
            get { return (string)this.GetValue(LabelProperty); }
            set { this.SetValue(LabelProperty, value); }
        }

        public bool TimerEnabled
        {
            get { return (bool)this.GetValue(TimerEnabledProperty); }
            set { this.SetValue(TimerEnabledProperty, value); }
        }
        #endregion

        protected override void OnApplyTemplate()
        {
            base.OnApplyTemplate();

            this.countdownTextBlock = this.GetTemplateChild("CountdownTextBlock") as TextBlock;
            if (this.countdownTextBlock == null)
            {
                throw new Exception("Invalid template");
            }

            this.countdownLabel = this.GetTemplateChild("CountdownLabel") as TextBlock;
            if (this.countdownLabel == null)
            {
                throw new Exception("Invalid template");
            }
        }

        private void Timer_Tick(object sender, object e)
        {
            if (this.DueTime != null)
            {
                TimeSpan remaining = this.DueTime.Value - DateTime.Now;

                int hours = remaining.Days * 24 + remaining.Hours;

                this.countdownTextBlock.Text = string.Format("{0}:{1:D2}:{2:D2}", hours, remaining.Minutes, remaining.Seconds);
            }
        }

        private void EnableTimer()
        {
            this.timer.Start();
        }

        private void DisableTimer()
        {
            this.timer.Stop();
        }

        private void SetLabel(string labelText)
        {
            if (!string.IsNullOrEmpty(labelText))
            {
                this.countdownTextBlock.Text = labelText;
            }
        }

        private static void OnTimerEnabledChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if ((bool)e.NewValue == true)
            {
                ((CountdownTimer)d).EnableTimer();
            }
            else
            {
                ((CountdownTimer)d).DisableTimer();
            }
        }

        private static void OnLabelChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            ((CountdownTimer)d).SetLabel((string)e.NewValue);
        }
    }
}
