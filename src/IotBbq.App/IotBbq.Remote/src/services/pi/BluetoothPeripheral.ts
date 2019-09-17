// tslint:disable-next-line: no-var-requires
const bleno: typeof import("bleno") = require("@abandonware/bleno");

import { Utils } from "../../Utils";
import { BluetoothConstants } from "../BluetoothConstants";
import { IBluetoothServer } from "../contracts/IBluetoothServer";
import { DataExportCharacteristic } from "../DataExportCharacteristic";
import { DataStorage } from "../DataStorage";
import { LoggerService } from "../LoggerService";
import { ProbeCharacteristic } from "../ProbeCharacteristic";
import { ThermometerService } from "../ThermometerService";

export class BluetoothPeripheral implements IBluetoothServer {

    private probeNumber = 0;

    constructor(
        private logger: LoggerService,
        private thermometerService: ThermometerService,
        private dataStorage: DataStorage) {
        // some diagnostics
        bleno.on("stateChange", (state) => this.logger.log(`Bleno: Adapter changed state to ${state}`));

        bleno.on("advertisingStart", (err) => this.logger.log("Bleno: advertisingStart"));
        bleno.on("advertisingStartError", (err) => this.logger.log("Bleno: advertisingStartError"));
        // bleno.on("advertisingStop", (err) => console.log("Bleno: advertisingStop"));

        bleno.on("servicesSet", (err) => this.logger.log("Bleno: servicesSet"));
        bleno.on("servicesSetError", (err) => this.logger.log("Bleno: servicesSetError"));

        bleno.on("accept", (clientAddress) => this.logger.log(`Bleno: accept ${clientAddress}`));
        bleno.on("disconnect", (clientAddress) => this.logger.log(`Bleno: disconnect ${clientAddress}`));
    }

    public async powerOn(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            if (bleno.state === "poweredOn") {
                return Promise.resolve();
            }

            // Start a timer to wait on the new state
            Utils.delay(5000).then(() => reject(new Error("Starting the device failed.")));

            try {
                bleno.on("stateChange", (state) => {
                    this.logger.log(`State change ${state}`);
                    if (state === "poweredOn") {
                        return resolve();
                    } else {
                        return reject(new Error(`State changed to ${state}`));
                    }
                });
            } catch (error) {
                return reject(error);
            }
        });
    }

    public async startAdvertising(): Promise<void> {
        const uuid = BluetoothConstants.ServiceUuid;
        const name = "Hamdallv2 Remote";

        return new Promise((resolve, reject) => {
            bleno.startAdvertising(name, [ uuid ], (error) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve();
                }
            });
        });
    }

    public async registerPrimaryService(): Promise<void> {

        const characteristics: any[] = [];
        characteristics.push(new DataExportCharacteristic(this.dataStorage));
        for (let i = 1; i <= 8; i++) {
            characteristics.push(new ProbeCharacteristic(i, this.thermometerService));
        }

        const service = new bleno.PrimaryService({
            uuid: BluetoothConstants.ServiceUuid,
            characteristics,
        });

        const services = [
            service,
        ];

        return new Promise<void>((resolve, reject) => {
            bleno.setServices(services, (error) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve();
                }
            });
        });

    }
}
