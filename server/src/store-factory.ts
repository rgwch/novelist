import { S3Store } from './s3-store';
import { FileStore } from './file-store';
import config from 'config'

export class StoreFactory {
    public getFileStore(): IStore {
        if (config.has("storage")) {
            const s = config.get("storage")
            if(s=="file"){
                return new FileStore(config.get("file"))
            }else if(s=="s3"){
                return new S3Store(config.get("s3"))
            }else{
                throw new Error("Storage vonfiguration not found: "+s)
            }
        } else {
            throw new Error("no storage defined")
        }

    }
   
}

export const storeFactory = new StoreFactory()
