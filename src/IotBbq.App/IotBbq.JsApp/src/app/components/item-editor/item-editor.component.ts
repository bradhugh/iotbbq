import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IBbqItem } from '../../services/BbqItem';

@Component({
  selector: 'app-item-editor-content',
  templateUrl: './item-editor.component.html',
})
export class ItemEditorComponent implements OnInit {
  @Input() public title: string;
  @Input() public closeBtnName: string;

  @Input() public item: IBbqItem = null;

  @Input() public itemTypeChoices: string[] = [];

  @Input() public probeNumberChoices: number[] = [];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }
}
