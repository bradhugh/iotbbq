import { Component, OnInit, Inject } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { DATA_STORAGE_TOKEN, IDataStorage } from '../../services/IDataStorage';
import { IBbqEvent } from '../../services/BbqEvent';
import { Router } from '@angular/router';
import { EventEditorService } from '../../services/EventEditorService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public events: IBbqEvent[] = [];

  public selectedEventId: string = null;

  constructor(
    private electronService: ElectronService,
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
    private router: Router,
    private eventEditor: EventEditorService,
  ) { }

  async ngOnInit() {

    const firstEvent = await this.dataStorage.getEventById('1');
    if (!firstEvent) {
      await this.dataStorage.insertEvent({
        id: '1',
        eventDate: new Date('2019-02-11'),
        name: 'Bbq Country Classic',
        turnInTime: new Date('2019-02-11T22:00:00Z'),
      });
    }

    this.events = await this.dataStorage.getEvents();

    // await this.dataStorage.insertItem({
    //   id: '1',
    //   eventId: '1',
    //   name: 'Item 1',
    //   cookStartTime: new Date('2019-02-11'),
    //   currentPhase: 'On Smoker',
    //   targetTemperature: 70,
    //   temperature: 0,
    //   thermometerIndex: 1,
    //   weight: 10
    // });

    // await this.dataStorage.insertItem({
    //   id: '2',
    //   eventId: '1',
    //   name: 'Item 2',
    //   cookStartTime: new Date('2019-02-11'),
    //   currentPhase: 'On Smoker',
    //   targetTemperature: 70,
    //   temperature: 0,
    //   thermometerIndex: 2,
    //   weight: 10
    // });

    // await this.dataStorage.insertItem({
    //   id: '3',
    //   eventId: '1',
    //   name: 'Item 3',
    //   cookStartTime: new Date('2019-02-11'),
    //   currentPhase: 'On Smoker',
    //   targetTemperature: 70,
    //   temperature: 0,
    //   thermometerIndex: 3,
    //   weight: 10
    // });

    // await this.dataStorage.insertItem({
    //   id: '4',
    //   eventId: '1',
    //   name: 'Item 4',
    //   cookStartTime: new Date('2019-02-11'),
    //   currentPhase: 'On Smoker',
    //   targetTemperature: 70,
    //   temperature: 0,
    //   thermometerIndex: 4,
    //   weight: 10
    // });
  }

  public async createNewEventClicked() {
    const event = await this.eventEditor.editEvent();
    if (event) {
      this.router.navigate([ '/cook', event.id ]);
    }
  }

  public openExistingEventClicked() {
    if (this.selectedEventId) {
      this.router.navigate([ '/cook', this.selectedEventId ]);
    }
  }

  public exitButtonClicked() {
    if (this.electronService.isElectron()) {
      this.electronService.remote.app.exit();
    }
  }
}
