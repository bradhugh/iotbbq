using GalaSoft.MvvmLight;
using MvvmValidation;
using System;
using System.Collections;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.ViewModels
{
    public class ValidatingViewModel : ViewModelBase, INotifyDataErrorInfo
    {
        private NotifyDataErrorInfoAdapter notifyDataErrorInfoAdapter;

        public ValidatingViewModel()
        {
            this.Validator = new ValidationHelper();
            this.notifyDataErrorInfoAdapter = new NotifyDataErrorInfoAdapter(this.Validator);
        }

        public ValidationHelper Validator { get; }

        public bool HasErrors
        {
            get { return this.notifyDataErrorInfoAdapter.HasErrors; }
        }

        public event EventHandler<DataErrorsChangedEventArgs> ErrorsChanged
        {
            add { this.notifyDataErrorInfoAdapter.ErrorsChanged += value; }
            remove { this.notifyDataErrorInfoAdapter.ErrorsChanged -= value; }
        }

        public IEnumerable GetErrors(string propertyName)
        {
            return this.notifyDataErrorInfoAdapter.GetErrors(propertyName);
        }
    }
}
