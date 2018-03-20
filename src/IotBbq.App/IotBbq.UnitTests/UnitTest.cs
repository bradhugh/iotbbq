
using System;
using System.Diagnostics;
using IotBbq.App;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace IotBbq.UnitTests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestConvertVoltageToResistence()
        {
            // This was checked with https://www.allaboutcircuits.com/tools/voltage-divider-calculator/
            double data = TempUtils.GetThermistorResistenceFromVoltage(3.3, 1.66, 100000);
            Assert.AreEqual(98795, (int)data);
        }

        [TestMethod]
        public void TestConvertVoltageToResistance2()
        {
            // Got Resistance 235409.820661915 from voltage 2.3161289870739
            double data = TempUtils.GetThermistorResistenceFromVoltage(3.3, 2.3161289870739, 100000);
            Assert.AreEqual(42479, (int)data);
        }

        [TestMethod]
        public void TestTheseNumbers()
        {
            double a, b, c;
            a = -1.373357407E-3;
            b = 4.914938378E-4;
            c = -5.890760444E-7;

            double tempK = TempUtils.ResistanceToTemp(a, b, c, 101219);
            Assert.AreEqual(295, Math.Round(tempK));

            double tempC = TempUtils.KelvinToCelcius(tempK);
            Assert.AreEqual(22, Math.Round(tempC));

            double tempF = TempUtils.CelciusToFarenheight(tempC);
            Assert.AreEqual(71, Math.Round(tempF));
        }

        [TestMethod]
        public void TestAgain()
        {
            // 33500 / 122F
            double a, b, c;
            a = -1.373357407E-3;
            b = 4.914938378E-4;
            c = -5.890760444E-7;

            double tempK = TempUtils.ResistanceToTemp(a, b, c, 33500);
            Assert.AreEqual(325, Math.Round(tempK));

            double tempC = TempUtils.KelvinToCelcius(tempK);
            Assert.AreEqual(51, Math.Round(tempC));

            double tempF = TempUtils.CelciusToFarenheight(tempC);
            Assert.AreEqual(124, Math.Round(tempF));
        }
    }
}
