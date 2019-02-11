import { Component, OnInit } from '@angular/core';
import { IBbqItem } from '../../services/BbqItem';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: [ './cook.component.scss' ]
})
export class CookComponent implements OnInit {

  public items: IBbqItem[] = [];

  constructor() { }

  ngOnInit() {
    this.items.push({name: 'Item 1'});
    this.items.push({name: 'Item 2'});
    this.items.push({name: 'Item 3'});
    this.items.push({name: 'Item 4'});
    this.items.push({name: 'Item 5'});
    this.items.push({name: 'Item 6'});
  }

}
