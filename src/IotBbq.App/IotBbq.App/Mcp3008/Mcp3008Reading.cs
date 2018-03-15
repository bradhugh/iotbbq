// Copyright © 2015 Daniel Porrey
//
// This file is part of the Windows.Devices.Sensors.Mcp3008 project.
// 
// Windows.Devices.Sensors.Mcp3008 is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Windows.Devices.Sensors.Mcp3008 is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Windows.Devices.Sensors.Mcp3008. If not, see http://www.gnu.org/licenses/.
//

namespace IotBbq.App.Mcp3008
{
    /// <summary>
    /// Contains the values read from a channel on the MCP3008.
    /// </summary>
    public partial class Mcp3008Reading
    {
        /// <summary>
        /// Creates a default instance of Windows.Devices.Sensors.Mcp3008Reading.
        /// </summary>
        internal Mcp3008Reading()
        {
        }

        /// <summary>
        /// Creates a default instance of Windows.Devices.Sensors.Mcp3008Reading
        /// with the given raw value.
        /// </summary>
        internal Mcp3008Reading(int rawValue)
        {
            this.RawValue = rawValue;
        }

        /// <summary>
        /// Gets the actual value read from the channel.
        /// </summary>
        public int RawValue { get; set; }

        /// <summary>
        /// Gets a normalized value in the range of 0 to 1.
        /// </summary>
        public float NormalizedValue => this.RawValue.Normalize(1023f);

        /// <summary>
        /// Implicitly converts the value read from the channel to
        /// a normalized float value.
        /// </summary>
        /// <param name="value">Returns the normalized value.</param>
        public static implicit operator float(Mcp3008Reading value) => value.NormalizedValue;

        /// <summary>
        /// Implicitly converts the value read from the channel to
        /// the raw integer value.
        /// </summary>
        /// <param name="value">Returns the raw value.</param>
        public static implicit operator int(Mcp3008Reading value) => value.RawValue;
    }
}
