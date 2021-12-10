import { Collection, MongoClient } from "mongodb";
import { IProbeLog } from "../model/IProbeLog";

export class DataStorage {

    private static async getCollectionAsync<T>(client: MongoClient, dbName: string, collectionName: string): Promise<Collection<T>> {
        const dbo = client.db(dbName);
        let collection = dbo.collection<T>(collectionName);
        if (!collection) {
            collection = await dbo.createCollection<T>(collectionName);
        }

        return collection;
    }

    private serverUrl = "mongodb://localhost:27017/";

    private dbName = "pigdrassil";

    private probeLogsCollectionName = "probeLogs";

    private getClientTask: Promise<MongoClient> = null;

    public async logProbesAsync(logs: IProbeLog[]): Promise<void> {
        const client = await this.getClientAsync();

        const probeLogs = await DataStorage.getCollectionAsync<IProbeLog>(client, this.dbName, this.probeLogsCollectionName);
        await probeLogs.insertMany(logs);
        console.log(`DataStorage: logged ${logs.length} probe logs.`);
    }

    private getClientAsync(): Promise<MongoClient> {
        if (!this.getClientTask) {
            this.getClientTask = MongoClient.connect(this.serverUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        }

        return this.getClientTask;
    }
}
