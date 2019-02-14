import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Inject } from '@angular/core';
import { ItemEditorComponent } from '../components/item-editor/item-editor.component';
import { IBbqItem } from './BbqItem';

export class ItemEditorService {

  private bsModalRef: BsModalRef;

  constructor(
    @Inject(BsModalService) private modalService: BsModalService) {
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

    this.bsModalRef = this.modalService.show(ItemEditorComponent, {initialState});
  }
}
