import { BluetoothConstants } from "./BluetoothConstants";
import { ThermometerService } from "./ThermometerService";

// tslint:disable-next-line: no-var-requires
const bleno: typeof import("bleno") = require("@abandonware/bleno");

export class ProbeCharacteristic extends bleno.Characteristic {

    public static probeUuids: string[] = [
        BluetoothConstants.Probe1,
        BluetoothConstants.Probe2,
        BluetoothConstants.Probe3,
        BluetoothConstants.Probe4,
        BluetoothConstants.Probe5,
        BluetoothConstants.Probe6,
        BluetoothConstants.Probe7,
        BluetoothConstants.Probe8,
    ];

    constructor(
        private probeNumber: number,
        private thermometerService: ThermometerService) {
        super({
            uuid: ProbeCharacteristic.probeUuids[probeNumber - 1],
            properties: ["read"],
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: `Probe${probeNumber}`,
                }),
            ],
        });
    }

    public async onReadRequest(offset: number, callback: (result: number, data?: Buffer) => void): Promise<void> {

        if (this.probeNumber < 1 || this.probeNumber > 8) {
            return callback(1);
        }

        const temperature = await this.thermometerService.readThermometer(this.probeNumber);

        const buffer = Buffer.alloc(4, 0);
        buffer.writeFloatBE(temperature.farenheight, 0);

        callback(bleno.Characteristic.RESULT_SUCCESS, buffer);
    }
}
