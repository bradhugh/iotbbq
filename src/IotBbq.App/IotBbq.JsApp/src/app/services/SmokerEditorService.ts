import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SmokerEditorComponent } from '../components/smoker-editor/smoker-editor.component';
import { ISmokerSettings, SmokerSettings } from '../model/SmokerSettings';

export class SmokerEditorService {

  private dialogRef: MatDialogRef<SmokerEditorComponent>;

  constructor(
    @Inject(MatDialog) private modalService: MatDialog) {
  }

  public async editSettings(settings: ISmokerSettings): Promise<ISmokerSettings> {

    const tempSettings = new SmokerSettings();
    tempSettings.load(settings);

    const initialState = {
      settings: tempSettings
    };

    this.dialogRef = this.modalService.open(SmokerEditorComponent, {
      data: initialState,
      minWidth: '75%',
    });

    const result: boolean = await this.dialogRef.afterClosed().toPromise();
    if (result) {
      tempSettings.writeTo(settings);

      window.localStorage.setItem('smokerSettings', JSON.stringify(tempSettings));
    }

    return settings;
  }
}

