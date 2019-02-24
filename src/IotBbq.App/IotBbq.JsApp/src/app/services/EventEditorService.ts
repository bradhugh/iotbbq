import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Utility } from './Utility';
import { DATA_STORAGE_TOKEN, IDataStorage } from './contracts/IDataStorage';
import { IBbqEvent, BbqEvent } from '../model/BbqEvent';
import { EventEditorComponent } from '../components/event-editor/event-editor.component';
import * as moment from 'moment';

export class EventEditorService {

  private dialogRef: MatDialogRef<EventEditorComponent>;

  constructor(
    @Inject(MatDialog) private modalService: MatDialog,
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage) {
  }

  public async editEvent(event: IBbqEvent = null): Promise<IBbqEvent> {

    const isNew = event === null;
    if (isNew) {
      event = new BbqEvent();
      event.id = Utility.createGuid();

      // New event defaults
      const today = moment().startOf('day');
      event.eventDate = today.toDate();
      event.turnInTime = today.add(1, 'days').add(10, 'hours').toDate();
    }

    const tempEvent = new BbqEvent();
    tempEvent.load(event);

    const initialState = {
      event: tempEvent,
      title: 'Edit Event',
    };

    this.dialogRef = this.modalService.open(EventEditorComponent, {
      data: initialState,
      minHeight: '300px',
      minWidth: '75%'
    });

    const result: boolean = await this.dialogRef.afterClosed().toPromise();
    if (result) {
      tempEvent.writeTo(event);

      if (isNew) {
        await this.dataStorage.insertEvent(event);
      } else {
        throw new Error('Updating event currently not implemented');
        // await this.dataStorage.updateEvent(event);
      }
    } else {
      return null;
    }

    return event;
  }
}
