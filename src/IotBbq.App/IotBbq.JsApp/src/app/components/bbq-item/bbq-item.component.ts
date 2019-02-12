import { Component, OnInit, Input } from '@angular/core';
import { IBbqItem } from '../../services/BbqItem';

@Component({
  selector: 'app-bbq-item',
  templateUrl: './bbq-item.component.html',
  styleUrls: [ './bbq-item.component.scss' ]
})
export class BbqItemComponent implements OnInit {

  @Input() public item: IBbqItem;

  constructor() { }

  ngOnInit() {
  }

}
