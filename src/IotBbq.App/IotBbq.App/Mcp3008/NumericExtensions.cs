// Copyright © 2015 Daniel Porrey
//
// This file is part of the Windows.Devices.Sensors.Calibration project.
// 
// Windows.Devices.Sensors.Calibration is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Windows.Devices.Sensors.Calibration is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Windows.Devices.Sensors.Calibration. If not, see http://www.gnu.org/licenses/.
//

namespace IotBbq.App.Mcp3008
{
    public static class NumericExtensions
    {
        /// <summary>
		/// Normalzies value to a number between 0 and 1.
		/// </summary>
		/// <param name="value">The value to be normalized.</param>
		/// <param name="maximumValue">The maximum of value.</param>
		/// <returns>Returns value normalized between 0 and 1.</returns>
		public static float Normalize(this int value, float maximumValue)
        {
            return (float)value / maximumValue;
        }
    }
}
