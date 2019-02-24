import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Inject } from '@angular/core';
import { ItemEditorComponent, IItemEditorComponentData } from '../components/item-editor/item-editor.component';
import { IBbqItem, BbqItem } from '../model/BbqItem';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Utility } from './Utility';
import { DATA_STORAGE_TOKEN, IDataStorage } from './contracts/IDataStorage';
import { ItemCatalog } from '../model/ItemCatalog';

export class ItemEditorService {

  private dialogRef: MatDialogRef<ItemEditorComponent>;
  private itemCatalog = new ItemCatalog();

  constructor(
    @Inject(MatDialog) private modalService: MatDialog,
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage) {
  }

  public async editItem(eventId: string, item: IBbqItem = null): Promise<IBbqItem> {

    const isNew = item === null;
    if (isNew) {
      item = new BbqItem();
      item.id = Utility.createGuid();
      item.eventId = eventId;

      // New items default to Butt
      item.itemType = 'Butt';
      item.targetTemperature = this.itemCatalog.findItemByType('Butt').defaultTargetTemp;
    }

    const tempItem = new BbqItem();
    tempItem.load(item);

    // Figure out which probe numbers are available
    const items = await this.dataStorage.getItems(eventId);
    const usedProbes = items.map(i => i.thermometerIndex);
    const allProbes = [ 1, 2, 3, 4, 5, 6 ];
    const availableProbes = allProbes.filter((v) => usedProbes.indexOf(v) === -1);

    // If we're editing, the current item probe number is also a valid choice
    if (!isNew) {
      availableProbes.push(item.thermometerIndex);
      availableProbes.sort();
    }

    const initialState: IItemEditorComponentData = {
      item: tempItem,
      title: isNew ? 'New Item' : 'Edit Item',
      itemTypeChoices: [
        'Butt',
        'Ribs'
      ],
      probeNumberChoices: availableProbes
    };

    this.dialogRef = this.modalService.open(ItemEditorComponent, {
      data: initialState,
      minWidth: '75%',
    });

    const result: boolean = await this.dialogRef.afterClosed().toPromise();
    if (result) {
      tempItem.writeTo(item);

      if (isNew) {
        await this.dataStorage.insertItem(item);
      } else {
        await this.dataStorage.updateItem(item);
      }

      return item;
    }

    return null;
  }
}
