import { Component, OnInit, Input } from '@angular/core';
import { ISmokerModel } from '../../model/SmokerSettings';
import { SmokerEditorService } from '../../services/SmokerEditorService';

@Component({
  selector: 'app-smoker',
  templateUrl: './smoker.component.html',
  styleUrls: [ './smoker.component.scss' ]
})
export class SmokerComponent implements OnInit {

  public model: ISmokerModel = {
    highGate: 0,
    lowGate: 0,
    temperature: 0
  };

  constructor(private smokerEditor: SmokerEditorService) { }

  ngOnInit() {
    const settings = window.localStorage.getItem('smokerSettings');
    if (settings) {
      this.model = JSON.parse(settings);
      this.model.temperature = 0;
    }
  }

  public async onSmokerComponentClicked() {
    await this.smokerEditor.editSettings(this.model);
  }
}
