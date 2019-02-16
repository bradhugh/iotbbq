
import { Utility } from '../Utility';
import { AlarmServiceBase } from '../AlarmServiceBase';

export class DesignAlarmService extends AlarmServiceBase {
  protected async doOneBeep(durationInMs: number): Promise<void> {
    console.log('pin high');
    await Utility.sleep(durationInMs);
    console.log('pin low');
  }
}
