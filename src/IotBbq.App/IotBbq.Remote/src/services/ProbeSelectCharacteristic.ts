// tslint:disable-next-line: no-var-requires
const bleno: typeof import("bleno") = require("@abandonware/bleno");

const ARGUMENT_1_UUID = "00010001-89BD-43C8-9231-40F6E305F96D";

export class ProbeSelectCharacteristic extends bleno.Characteristic {

    constructor(private probeNumberSetter: (probeNum: number) => void) {
        super({
            uuid: ARGUMENT_1_UUID,
            properties: ["write"],
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: "Probe Select",
                  }),
            ],
        });
    }

    public onWriteRequest(data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void): void {

        const probeNum = data[0];

        // TODO: Validate probe number

        this.probeNumberSetter(probeNum);

        callback(0);
    }
}
