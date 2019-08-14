const bleno: typeof import("bleno") = require("@abandonware/bleno");

import { Utils } from "../Utils";
import { TemperatureCharacteristic } from "./TemperatureCharacteristic";
import { ProbeSelectCharacteristic } from "./ProbeSelectCharacteristic";
import { ThermometerService } from "./ThermometerService";
import { NodeSpiClient } from "./NodeSpiClient";

const CALCULATOR_SERVICE_UUID = "00010000-89BD-43C8-9231-40F6E305F96D";
const RESULT_UUID = "00010010-89BD-43C8-9231-40F6E305F96D";

export class BluetoothPeripheral {

    private probeNumber = 0;

    constructor() {
        // some diagnostics 
        bleno.on("stateChange", state => console.log(`Bleno: Adapter changed state to ${state}`));

        bleno.on("advertisingStart", err => console.log("Bleno: advertisingStart"));
        bleno.on("advertisingStartError", err => console.log("Bleno: advertisingStartError"));
        //bleno.on("advertisingStop", (err) => console.log("Bleno: advertisingStop"));

        bleno.on("servicesSet", err => console.log("Bleno: servicesSet"));
        bleno.on("servicesSetError", err => console.log("Bleno: servicesSetError"));

        bleno.on("accept", clientAddress => console.log(`Bleno: accept ${clientAddress}`));
        bleno.on("disconnect", clientAddress => console.log(`Bleno: disconnect ${clientAddress}`));
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
                    console.log(`State change ${state}`);
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
        const uuid = CALCULATOR_SERVICE_UUID;
        const name = 'Hamdallv2 Remote';

        return new Promise((resolve, reject) => {
            bleno.startAdvertising(name, [ uuid ], (error) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve();
                }
            });
        })
    }

    public async registerPrimaryService(): Promise<void> {

        const spiClient = new NodeSpiClient();

        const thermSvc = new ThermometerService(spiClient);
        const probeSelect = new ProbeSelectCharacteristic((value) => this.probeNumber = value);
        const temperature = new TemperatureCharacteristic(() => this.probeNumber, thermSvc);

        const service = new bleno.PrimaryService({
            uuid: CALCULATOR_SERVICE_UUID,
            characteristics: [
                probeSelect,
                temperature
            ]
        });

        const services = [
            service
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