using System;
using System.Collections.Generic;
using System.Text;

namespace IotBbq.Model
{
    public class EntityBase
    {
        public Guid Id { get; set; } = Guid.NewGuid();
    }
}
