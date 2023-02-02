import { StoreFactory } from './store-factory';

export class S3Store implements IStore {
    constructor(private pwd: string) {

    }
    setPassword(pwd: string) {
        throw new Error("Method not implemented.");
    }
    
    save(data_Buffer: Buffer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    load(): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }

}


