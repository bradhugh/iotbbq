import { HostListener, Component } from '@angular/core';
import { ElectronService } from './electron.service';

@Component({
  selector: 'app-exit-service',
  template: '<div display="none"></div>'
})
export class ExitService {
  private exitPattern = '';

  constructor(
    private electronService: ElectronService
  ) {}

  @HostListener('window:keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'e' && this.exitPattern === '') {
      this.exitPattern += 'e';
    } else if (event.key === 'x' && this.exitPattern === 'e') {
      this.exitPattern += 'x';
    } else if (event.key === 'i' && this.exitPattern === 'ex') {
      this.exitPattern += 'i';
    } else if (event.key === 't' && this.exitPattern === 'exi') {
      this.exitPattern += 't';
      this.performExit();
    } else {
      this.exitPattern = '';
    }
  }

  performExit(): void {
    if (this.electronService.isElectron) {
      this.electronService.remote.app.exit();
    }
  }
}
