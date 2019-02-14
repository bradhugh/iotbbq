import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-item-editor-content',
  templateUrl: './item-editor.component.html',
})

export class ItemEditorComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    this.list.push('PROFIT!!!');
  }
}
