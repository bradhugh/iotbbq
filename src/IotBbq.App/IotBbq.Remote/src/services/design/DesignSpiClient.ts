import { ISpiClient } from "../contracts/ISpiClient";

export class DesignSpiClient implements ISpiClient {
    public async initialize(chipSelectLine: number): Promise<void> {
        // Intentionally blank
    }

    public async transfer(buffer: Uint8Array): Promise<Uint8Array> {
        const data = new Uint8Array(3);
        data[0] = 0; // This digit doesn't matter / isn't used
        data[1] = Math.round(Math.random() * 3); // Values from 0-3
        data[2] = Math.round(Math.random() * 255); // Values from 0-255
        return data;
    }

    public close(): void {
        // Intentionally blank
    }
}
