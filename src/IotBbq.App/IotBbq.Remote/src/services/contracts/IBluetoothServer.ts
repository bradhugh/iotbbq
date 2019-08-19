export interface IBluetoothServer {
    powerOn(): Promise<void>;
    startAdvertising(): Promise<void>;
    registerPrimaryService(): Promise<void>;
}
