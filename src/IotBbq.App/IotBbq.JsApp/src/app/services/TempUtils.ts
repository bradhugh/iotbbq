export class TempUtils {
  public static getThermistorResistanceFromVoltage(vin: number, vout: number, resistorOhms: number): number {
    // vout = ThermistorOhms / ((resistorOhms + ThermistorOhms) * vin)
    const thermistorOhms = ((vin - vout) / vout) * resistorOhms;
    return thermistorOhms;
  }

  // Steinhart-Hart
  public static resistanceToTemp(a: number, b: number, c: number, resistance: number): number {
      let temp = Math.log(resistance);  // Saving the Log(resistance) so not to calculate it 4 times later.
      temp = 1 / (a + (b * temp) + (c * temp * temp * temp));

      return temp;
  }

  public static kelvinToCelsius(kelvin: number): number {
      return kelvin - 273.15;  // Convert Kelvin to Celsius  
  }

  public static celsiusToFahrenheit(celcius: number): number {
      return (celcius * 9.0) / 5.0 + 32.0;
  }
}
