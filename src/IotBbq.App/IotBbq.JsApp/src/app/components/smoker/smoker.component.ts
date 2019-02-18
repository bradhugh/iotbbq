import { Component, OnInit, Input } from '@angular/core';
import { ISmokerModel } from '../../model/SmokerSettings';

@Component({
  selector: 'app-smoker',
  templateUrl: './smoker.component.html',
  styleUrls: [ './smoker.component.scss' ]
})
export class SmokerComponent implements OnInit {

  @Input() public model: ISmokerModel = {
    highGate: 0,
    lowGate: 0,
    temperature: 0
  };

  constructor() { }

  ngOnInit() {
  }

}
