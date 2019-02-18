import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-phase-picker',
  templateUrl: './phase-picker.component.html',
  styleUrls: [ './phase-picker.component.scss' ],
})
export class PhasePickerComponent implements OnInit {
  @Input() public title: string;

  constructor(
    public dialogRef: MatDialogRef<PhasePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }
}
