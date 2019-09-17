import { BluetoothConstants } from "./BluetoothConstants";
import { DataStorage } from "./DataStorage";

// tslint:disable-next-line: no-var-requires
const bleno: typeof import("bleno") = require("@abandonware/bleno");

type ValueCallback = (buffer: Buffer) => void;

export class DataExportCharacteristic extends bleno.Characteristic {

    private subscriptions: ValueCallback[] = [];

    constructor(private dataStorage: DataStorage) {
        super({
            uuid: BluetoothConstants.DataExportCharacteristic,
            properties: ["read", "write", "notify"],
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: "Probe Select",
                  }),
            ],
        });
    }

    public onWriteRequest(data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void): void {

        callback(bleno.Characteristic.RESULT_SUCCESS);

        // Do the reads right now and notify
        // this.dataStorage.logProbesAsync

        // for (const sub of this.subscriptions) {
        //     sub(Buffer)
        // }
    }

    public onReadRequest(offset: number, callback: (result: number, data?: Buffer) => void): void {
        const buffer: Buffer = null;
        callback(bleno.Characteristic.RESULT_SUCCESS, buffer);
    }

    public onSubscribe(maxValueSize: number, updateValueCallback: ValueCallback): void {
        this.subscriptions.push(updateValueCallback);
    }

    public onUnsubscribe(): void {
        this.subscriptions = [];
    }
}
