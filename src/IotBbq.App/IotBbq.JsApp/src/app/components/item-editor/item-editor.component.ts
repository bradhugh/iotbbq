import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-item-editor',
  templateUrl: './item-editor.component.html',
})
export class ItemEditorComponent implements OnInit {

  @Input() public title: string;

  constructor(
    public dialogRef: MatDialogRef<ItemEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.title = data.title;
    }

  public ngOnInit() {
  }
}
