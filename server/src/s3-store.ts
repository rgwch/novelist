import { StoreFactory } from './store-factory';

export class S3Store implements IStore {
    constructor(private pwd: string) {

    }
    setPassword(pwd: string) {
        throw new Error("Method not implemented.");
    }
    create(password: string): IStore {
        throw new Error("Method not implemented.");
    }
    save(id: string, data_Buffer: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    load(id: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }

}


