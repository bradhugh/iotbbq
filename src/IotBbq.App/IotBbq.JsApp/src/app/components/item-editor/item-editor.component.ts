import { Component, OnInit, Input, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialogRef } from '@angular/material/dialog';
import { IBbqItem } from '../../model/BbqItem';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-item-editor',
  templateUrl: './item-editor.component.html',
})
export class ItemEditorComponent implements OnInit {
  @Input() public title: string;

  @Input() public item: IBbqItem = null;

  @Input() public itemTypeChoices: string[] = [];

  @Input() public probeNumberChoices: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<ItemEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  ngOnInit() {
  }
}
