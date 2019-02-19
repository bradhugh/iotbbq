const remote = require('electron').remote;
const drivelist: typeof import('drivelist') = remote.require('drivelist');
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { Inject } from '@angular/core';
import { DATA_STORAGE_TOKEN, IDataStorage } from './IDataStorage';
import { BbqEvent } from '../model/BbqEvent';

export class ExportService {

  constructor(
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage
  ) {}

  public async getRemovableDrives(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      drivelist.list((error, drives) => {
        if (error) {
          return reject(error);
        }

        const paths: string[] = [];
        for (const drive of drives) {
          // if (!drive.isSystem && drive.isUSB && drive.mountpoints.length !== 0) {
            paths.push(drive.mountpoints[0].path);
          // }
        }

        resolve(paths);
      });
    });
  }

  public async exportData(eventId: string): Promise<void> {
    const now = moment();
    const event = await this.dataStorage.getEventById(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist in the database`);
    }

    const folder: string = await this.pickExportFolder(event.name, now);
    await this.exportEvent(event.id, folder, now);
    await this.exportItems(event.id, event.name, folder, now);
    await this.exportItemLogs(event.id, event.name, folder, now);
  }

  private async exportEvent(eventId: string, folder: string, timestamp: moment.Moment) {
    const event = await this.dataStorage.getEventById(eventId);
    const logName = this.cleanFileOrFolderName(`Events_${event.name}_${timestamp.format('YYYY-MM-DD_HHmmss')}.csv`);
    const logPath = path.join(folder, logName);
    fs.appendFileSync(logPath, 'EventId,EventDate,EventName,TurnInTime\r\n');
    fs.appendFileSync(logPath, `${event.id},${event.eventDate.toJSON()},${event.name},${event.turnInTime.toJSON()}\r\n`);
  }

  private async exportItems(eventId: string, eventName: string, folder: string, timestamp: moment.Moment) {
    const items = await this.dataStorage.getItems(eventId);

    const logName = this.cleanFileOrFolderName(`Items_${eventName}_${timestamp.format('YYYY-MM-DD_HHmmss')}.csv`);
    const logPath = path.join(folder, logName);

    // tslint:disable: max-line-length
    await this.appendFile(logPath, 'ItemId,BbqEventId,Name,ItemType,CurrentPhase,Weight,TargetTemperature,CookStartTime,ThermometerIndex\r\n');
    for (const item of items) {
      // TODO: CSV escape name
      await this.appendFile(logPath, `${item.id},${item.eventId},${item.name},${item.itemType},${item.currentPhase ? item.currentPhase : ''},${item.weight},${item.targetTemperature},${item.cookStartTime ? item.cookStartTime.toJSON() : ''},${item.thermometerIndex}\r\n`);
    }
  }

  private async exportItemLogs(eventId: string, eventName: string, folder: string, timestamp: moment.Moment) {

    // TODO: We may need to figure out how to do this one at a time - memory contraints
    const itemLogs = await this.dataStorage.getItemLogs(eventId);

    const logName = this.cleanFileOrFolderName(`ItemLog_${eventName}_${timestamp.format('YYYY-MM-DD_HHmmss')}.csv`);
    const logPath = path.join(folder, logName);
    await this.appendFile(logPath, 'ItemLogId,Timestamp,BbqItemId,ItemName,Temperature,CurrentPhase,Thermometer\r\n');
    for (const itemLog of itemLogs) {
      await this.appendFile(logPath, `${itemLog.id},${itemLog.timestamp.toJSON()},${itemLog.bbqItemId},${itemLog.itemName},${itemLog.temperature},${itemLog.currentPhase ? itemLog.currentPhase : ''},${itemLog.thermometer}\r\n`);
    }
  }

  private async pickExportFolder(eventName: string, timestamp: moment.Moment): Promise<string> {
    const folders = await this.getRemovableDrives();
    if (!folders.length) {
      return null;
    }

    const folderPath = path.join(folders[0], `${this.cleanFileOrFolderName(eventName)}_${timestamp.format('YYYY-MM-DD_HHmmss')}`);

    return new Promise<string>((resolve, reject) => {
      fs.mkdir(folderPath, (err) => {
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
      fs.appendFile(filename, data, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }
}
