import { BluetoothPeripheral } from "./services/BluetoothPeripheral";
import { LoggerService } from "./services/LoggerService";

(async () => {
    const logger = new LoggerService();

    const bt = new BluetoothPeripheral(logger);
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
