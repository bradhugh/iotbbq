import { MatDialog } from '@angular/material/dialog';
import { ClockEditorComponent } from '../components/clock-editor/clock-editor.component';
import { Inject } from '@angular/core';
import { XPlatService } from './XPlatService';

export class ClockEditorService {

  constructor(
    @Inject(MatDialog) private modalService: MatDialog,
    private xplat: XPlatService) {}

  public async EditClock(): Promise<void> {

    // We only support this for electron for now
    if (!this.xplat.isElectron()) {
      return;
    }

    const initialState = {
      currentDate: new Date(),
      title: 'Change System Date/Time',
    };

    const dialogRef = this.modalService.open(ClockEditorComponent, {
      data: initialState,
      minHeight: '300px',
      minWidth: '75%'
    });

    const result: boolean = await dialogRef.afterClosed().toPromise();
    if (result) {
      // change the date
      this.xplat.dateTimeControl.setDateTime(initialState.currentDate, { useSudo: true });
    }
  }
}
