import { NodeSpiClient } from "./services/NodeSpiClient";
import { Mcp3008, Channels } from "./services/Mcp3008";
import { BluetoothPeripheral } from "./services/BluetoothPeripheral";

(async function () {
    console.log("Hello World");

    const bt = new BluetoothPeripheral();
    try {
        await bt.powerOn();
        console.log("Bluetooth powered on");
        await bt.startAdvertising();
        console.log("Advertising started");
        await bt.registerPrimaryService();
        console.log("Registered Services");
    } catch (error) {
        console.log(`CATCH: ${error}`);
    }

})();
