import { S3Store } from './s3-store';
import { FileStore } from './file-store';

export class StoreFactory {
    public createStore(id: string, pwd: string): IStore {
        return new FileStore(id, pwd)
    }
    public list(): Promise<Array<string>> {
        return FileStore.list()
    }
}

export const storeFactory = new StoreFactory()
