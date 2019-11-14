import { DataStorage } from "./services/DataStorage";
import { DesignBluetoothServer } from "./services/design/DesignBluetoothServer";
import { DesignSpiClient } from "./services/design/DesignSpiClient";
import { LoggerService } from "./services/LoggerService";
import { BluetoothPeripheral } from "./services/pi/BluetoothPeripheral";
import { NodeSpiClient } from "./services/pi/NodeSpiClient";
import { ProbeLoggerService } from "./services/ProbeLoggerService";
import { ThermometerService } from "./services/ThermometerService";

(async () => {
    const logger = new LoggerService();

    // const spiClient = new NodeSpiClient();
    const spiClient = new DesignSpiClient();
    const thermometerService = new ThermometerService(spiClient);

    const dataStorage = new DataStorage();
    const bt = new BluetoothPeripheral(logger, thermometerService, dataStorage);
    // const bt = new DesignBluetoothServer();

    const probeLogger = new ProbeLoggerService(thermometerService, dataStorage);
    probeLogger.start();

    try {
        await bt.powerOn();
        logger.log("Bluetooth powered on");
        await bt.startAdvertising();
        logger.log("Advertising started");
        await bt.registerPrimaryService();
        logger.log("Registered Services");
    } catch (error) {
        logger.log(`CATCH: ${error}`);
    }
})();
