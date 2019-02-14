import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Inject } from '@angular/core';
import { ItemEditorComponent } from '../components/item-editor/item-editor.component';
import { IBbqItem } from './BbqItem';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export class ItemEditorService {

  private dialogRef: MatDialogRef<ItemEditorComponent>;

  constructor(
    @Inject(MatDialog) private modalService: MatDialog) {
  }

  public async editItem(item: IBbqItem): Promise<void> {

    const initialState = {
      item: item,
      title: 'Edit Item',
      itemTypeChoices: [
        'Butt',
        'Ribs'
      ],
      probeNumberChoices: [
        1, 2, 3, 4, 5, 6
      ]
    };

    this.dialogRef = this.modalService.open(ItemEditorComponent, {
      data: initialState
    });
  }
}
