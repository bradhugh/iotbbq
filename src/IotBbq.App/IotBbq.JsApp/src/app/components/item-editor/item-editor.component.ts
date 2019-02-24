import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IBbqItem } from '../../model/BbqItem';
import { ItemCatalog } from '../../model/ItemCatalog';
import { NgModel } from '@angular/forms';

export interface IItemEditorComponentData {
  title: string;
  item: IBbqItem;
  itemTypeChoices: string[];
  probeNumberChoices: number[];
}

@Component({
  selector: 'app-item-editor',
  templateUrl: './item-editor.component.html',
})
export class ItemEditorComponent implements OnInit {

  @Input() public title: string;

  private defaultTemps: { [itemType: string]: number; } = {};

  constructor(
    public dialogRef: MatDialogRef<ItemEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IItemEditorComponentData) {
      this.title = data.title;

      const catalog = new ItemCatalog();
      this.defaultTemps['Butt'] = catalog.findItemByType('Butt').defaultTargetTemp;
      this.defaultTemps['Ribs'] = catalog.findItemByType('Ribs').defaultTargetTemp;
    }

  public ngOnInit() {
  }

  public onItemTypeChanged(model: NgModel) {
    const oldType = model.model;
    const newType = this.data.item.itemType;
    const currentTarget = this.data.item.targetTemperature;

    // Reset the target if the current target is the default
    if (currentTarget === this.defaultTemps[oldType]) {
      this.data.item.targetTemperature = this.defaultTemps[newType];
    }
  }
}
