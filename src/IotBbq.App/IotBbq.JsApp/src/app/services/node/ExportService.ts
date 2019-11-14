import * as moment from 'moment';
import { Inject } from '@angular/core';
import { DATA_STORAGE_TOKEN, IDataStorage } from '../contracts/IDataStorage';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ExportStatusComponent } from '../../components/export-status/export-status.component';
import { IExportService } from '../contracts/IExportService';
import { XPlatService } from '../XPlatService';
import { Utility } from '../Utility';

export class ExportService implements IExportService {

  private dialogRef: MatDialogRef<ExportStatusComponent> = null;

  constructor(
    private xplat: XPlatService,
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
    @Inject(MatDialog) private modalService: MatDialog,
  ) {}

  public async exportData(eventId: string): Promise<void> {
    const now = moment();
    const event = await this.dataStorage.getEventById(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist in the database`);
    }

    const dialogData = {
      statusText: '',
      title: 'Export Event',
      percentComplete: '0%',
    };

    this.dialogRef = this.modalService.open(ExportStatusComponent, {
      minWidth: '50%',
      disableClose: true,
      data: dialogData,
    });

    try {
      const folder: string = await this.pickExportFolder(event.name, now);

      const estimatedItemLogs = 8 * 60 * 6;
      const estimatedSmokerLogs = 8 * 60;
      let estimatedTotalItems = estimatedItemLogs + estimatedSmokerLogs + 7;
      let itemsProcessed = 0;

      dialogData.statusText = 'Exporting Events...';
      await this.exportEvent(event.id, folder, now);
      itemsProcessed += 1;
      dialogData.percentComplete = Math.round((itemsProcessed / estimatedTotalItems) * 100) + '%';

      dialogData.statusText = 'Exporting Items...';
      await this.exportItems(event.id, event.name, folder, now);
      itemsProcessed += 6;
      dialogData.percentComplete = Math.round((itemsProcessed / estimatedTotalItems) * 100) + '%';

      dialogData.statusText = 'Exporting Item Logs...';
      let actualItemLogCount = 0;
      await this.exportItemLogs(event.id, event.name, folder, now, (status, current, total) => {

        if (!actualItemLogCount) {
          actualItemLogCount = total;
          estimatedTotalItems = actualItemLogCount + estimatedSmokerLogs + 7;
        }

        itemsProcessed++;

        dialogData.statusText = status;
        dialogData.percentComplete = Math.round((itemsProcessed / estimatedTotalItems) * 100) + '%';
      });

      dialogData.statusText = 'Exporting Smoker Logs...';
      let actualSmokerLogCount = 0;
      await this.exportSmokerLogs(event.id, event.name, folder, now, (status, current, total) => {

        if (!actualSmokerLogCount) {
          actualSmokerLogCount = total;
          estimatedTotalItems = actualItemLogCount + actualSmokerLogCount + 7;
        }

        itemsProcessed++;

        dialogData.statusText = status;
        dialogData.percentComplete = Math.round((itemsProcessed / estimatedTotalItems) * 100) + '%';
      });

      dialogData.statusText = 'Export Complete';
    } catch (err) {
      dialogData.statusText = `${err}`;
    }
    finally {
      this.dialogRef.componentInstance.inProgress = false;
    }
  }

  private async getRemovableDrives(): Promise<string[]> {

    const drives = await this.xplat.drivelist.list();

    const paths: string[] = [];
    for (const drive of drives) {
      if (!drive.isSystem && drive.isUSB && drive.mountpoints.length !== 0) {
        paths.push(drive.mountpoints[0].path);
      }
    }

    return paths;
  }

  private async exportEvent(eventId: string, folder: string, timestamp: moment.Moment) {
    const event = await this.dataStorage.getEventById(eventId);
    const logName = this.cleanFileOrFolderName(`Events_${event.name}_${timestamp.format('YYYY-MM-DD_HHmmss')}.csv`);
    const logPath = this.xplat.path.join(folder, logName);
    this.xplat.fs.appendFileSync(logPath, 'EventId,EventDate,EventName,TurnInTime\r\n');
    this.xplat.fs.appendFileSync(logPath, `${event.id},${event.eventDate.toJSON()},${event.name},${event.turnInTime.toJSON()}\r\n`);
  }

  private async exportItems(eventId: string, eventName: string, folder: string, timestamp: moment.Moment) {
    const items = await this.dataStorage.getItems(eventId);

    const logName = this.cleanFileOrFolderName(`Items_${eventName}_${timestamp.format('YYYY-MM-DD_HHmmss')}.csv`);
    const logPath = this.xplat.path.join(folder, logName);

    // tslint:disable: max-line-length
    await this.appendFile(logPath, 'ItemId,BbqEventId,Name,ItemType,CurrentPhase,Weight,TargetTemperature,CookStartTime,ProbeNumber\r\n');
    for (const item of items) {
      // TODO: CSV escape name
      await this.appendFile(logPath, `${item.id},${item.eventId},${item.name},${item.itemType},${item.currentPhase ? item.currentPhase : ''},${item.weight},${item.targetTemperature},${item.cookStartTime ? item.cookStartTime.toJSON() : ''},${item.probeNumber}\r\n`);
    }
  }

  private async exportItemLogs(eventId: string, eventName: string, folder: string, timestamp: moment.Moment, reportStatus: (status: string, current: number, total: number) => void) {

    const logName = this.cleanFileOrFolderName(`ItemLog_${eventName}_${timestamp.format('YYYY-MM-DD_HHmmss')}.csv`);
    const logPath = this.xplat.path.join(folder, logName);
    await this.appendFile(logPath, 'ItemLogId,Timestamp,BbqItemId,ItemName,Temperature,CurrentPhase,Thermometer\r\n');

    await this.dataStorage.forEachItemLog(eventId, (itemLog, current, total) => {
      reportStatus(`Exporting ItemLog ${current} of ${total}`, current, total);
      this.xplat.fs.appendFileSync(logPath, `${itemLog.id},${itemLog.timestamp.toJSON()},${itemLog.bbqItemId},${itemLog.itemName},${itemLog.temperature},${itemLog.currentPhase ? itemLog.currentPhase : ''},${itemLog.probeNumber}\r\n`);
    });
  }

  private async exportSmokerLogs(eventId: string, eventName: string, folder: string, timestamp: moment.Moment, reportStatus: (status: string, current: number, total: number) => void): Promise<void> {
    const logName = this.cleanFileOrFolderName(`SmokerLog_${eventName}_${timestamp.format('YYYY-MM-DD_HHmmss')}.csv`);
    const logPath = this.xplat.path.join(folder, logName);
    await this.appendFile(logPath, 'Id,Timestamp,EventId,SetTo,Temperature\r\n');

    await this.dataStorage.forEachSmokerLog(eventId, (log, current, total) => {
      reportStatus(`Exporting Smoker Log ${current} of ${total}`, current, total);
      this.xplat.fs.appendFileSync(logPath, `${log.id},${log.timestamp.toJSON()},${log.eventId},${log.setTo},${log.temperature}\r\n`);
    });
  }

  private async pickExportFolder(eventName: string, timestamp: moment.Moment): Promise<string> {
    const folders = await this.getRemovableDrives();
    if (!folders.length) {
      throw new Error('No USB drive is connected.');
    }

    const folderPath = this.xplat.path.join(folders[0], `${this.cleanFileOrFolderName(eventName)}_${timestamp.format('YYYY-MM-DD_HHmmss')}`);

    return new Promise<string>((resolve, reject) => {
      this.xplat.fs.mkdir(folderPath, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve(folderPath);
      });
    });
  }

  private cleanFileOrFolderName(name: string): string {
    return name.replace(new RegExp(/[^0-9a-zA-Z.-_]/, 'g'), '_');
  }

  private appendFile(filename: string, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.xplat.fs.appendFile(filename, data, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }
}
