import { Observable, Subscription, timer } from "rxjs";
import { IProbeLog } from "../model/IProbeLog";
import { DataStorage } from "./DataStorage";
import { ThermometerService } from "./ThermometerService";

export class ProbeLoggerService {
    private logInterval = 1000 * 60;

    private probeLogTimer: Observable<number> = null;

    private timerSubscription: Subscription = null;

    constructor(
        private thermometer: ThermometerService,
        private dataStorage: DataStorage) { }

    public start() {
        this.probeLogTimer = timer(0, this.logInterval);
        this.timerSubscription = this.probeLogTimer.subscribe(async () => await this.onTimerTick());
    }

    public stop() {
        this.timerSubscription.unsubscribe();
        this.probeLogTimer = null;
    }

    private async onTimerTick(): Promise<void> {

        const probeLogs = [];
        const timestamp = new Date();
        for (let num = 1; num <= 8; num++) {
            const temp = await this.thermometer.readThermometer(num);
            const entry: IProbeLog = {
                probeNumber: num,
                timestamp,
                temperature: temp.farenheight,
            };

            probeLogs.push(entry);
        }

        await this.dataStorage.logProbesAsync(probeLogs);
    }
}
