import { ISmokerSettings } from '../../model/SmokerSettings';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utility } from '../../services/Utility';

@Component({
  selector: 'app-smoker-editor',
  templateUrl: './smoker-editor.component.html',
})
export class SmokerEditorComponent implements OnInit {
  @Input() public title: string;

  constructor(
    public dialogRef: MatDialogRef<SmokerEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }
}
