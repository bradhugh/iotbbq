import { IBluetoothServer } from "../contracts/IBluetoothServer";

export class DesignBluetoothServer implements IBluetoothServer {
    public powerOn(): Promise<void> {
        return Promise.resolve();
    }

    public startAdvertising(): Promise<void> {
        return Promise.resolve();
    }

    public registerPrimaryService(): Promise<void> {
        return Promise.resolve();
    }
}
