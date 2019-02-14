import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Inject } from '@angular/core';
import { ItemEditorComponent } from '../components/item-editor/item-editor.component';

export class ItemEditorService {

  private bsModalRef: BsModalRef;

  constructor(
    @Inject(BsModalService) private modalService: BsModalService) {
  }

  public async editItem(): Promise<void> {
    this.openModalWithComponent();
  }

  private openModalWithComponent() {
    const initialState = {
      list: [
        'Open a modal with component',
        'Pass your data',
        'Do something else',
        '...'
      ],
      title: 'Modal with component'
    };
    this.bsModalRef = this.modalService.show(ItemEditorComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
