import { ThermometerService } from "./ThermometerService";

// tslint:disable-next-line: no-var-requires
const bleno: typeof import("bleno") = require("@abandonware/bleno");

const RESULT_UUID = "00010010-89BD-43C8-9231-40F6E305F96D";

export class TemperatureCharacteristic extends bleno.Characteristic {

    constructor(
        private probeNumberAccessor: () => number,
        private thermometerService: ThermometerService) {
        super({
            uuid: RESULT_UUID,
            properties: ["read"],
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: "Temperature",
                }),
            ],
        });
    }

    public async onReadRequest(offset: number, callback: (result: number, data?: Buffer) => void): Promise<void> {

        const probeNum = this.probeNumberAccessor();
        if (probeNum < 1 || probeNum > 8) {
            return callback(1);
        }

        const temperature = await this.thermometerService.readThermometer(probeNum);

        const buffer = Buffer.alloc(4, 0);
        buffer.writeFloatBE(temperature.farenheight, 0);

        callback(0, buffer);
    }
}
