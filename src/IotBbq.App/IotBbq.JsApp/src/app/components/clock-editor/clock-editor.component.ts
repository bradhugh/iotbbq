import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IClockEditorData {
  title: string;
  currentDate: Date;
}

@Component({
  selector: 'app-clock-editor',
  templateUrl: './clock-editor.component.html',
  styleUrls: [ './clock-editor.component.scss' ]
})
export class ClockEditorComponent {
  @Input() public title: string;

  constructor(
    public dialogRef: MatDialogRef<ClockEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IClockEditorData) {

    this.title = data.title;
  }
}
