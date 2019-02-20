import { Component, OnInit, Inject } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { DATA_STORAGE_TOKEN, IDataStorage } from '../../services/IDataStorage';
import { IBbqEvent } from '../../model/BbqEvent';
import { Router } from '@angular/router';
import { EventEditorService } from '../../services/EventEditorService';
import { EXPORT_SERVICE_TOKEN, IExportService } from '../../services/IExportService';

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
    @Inject(EXPORT_SERVICE_TOKEN) private exportService: IExportService,
  ) { }

  async ngOnInit() {
    this.events = await this.dataStorage.getEvents();
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

  public exportEventClicked() {
    this.exportService.exportData(this.selectedEventId);
  }
}
