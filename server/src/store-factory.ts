import { S3Store } from './s3-store';
import { FileStore } from './file-store';
import config from 'config'
import { DateTime } from 'luxon'


export class StoreFactory implements IStore {
    private store: IStore

    constructor() {
        if (config.has("storage")) {
            const s = config.get("storage")
            if (s == "file") {
                this.store = new FileStore(config.get("file"))
            } else if (s == "s3") {
                this.store = new S3Store(config.get("s3"))
            } else {
                throw new Error("Storage vonfiguration not found: " + s)
            }
        } else {
            throw new Error("no storage defined")
        }

    }
    createStorable(id: string, passphrase: string): IStorable {
        return this.store.createStorable(id, passphrase)
    }
    removeObject(id: string): Promise<void> {
        return this.store.removeObject(id)
    }
    listObjects(pat=/.*/): Promise<string[]> {
        return this.store.listObjects(pat)
    }
    queryObject(id: string): Promise<any> {
        return this.store.queryObject(id)
    }
    renameObject(id: string, newId: string): Promise<void> {
        return this.store.renameObject(id, newId)
    }

    extname(id: string): string {
        const dot = id.lastIndexOf(".")
        if (dot == -1) {
            return ""
        } else {
            return id.substring(dot)
        }
    }

    basename(id: string): string {
        const ext = this.extname(id)
        const base = id.substring(0, id.length - ext.length)
        return base
    }
    async rotate(id: string, generations: number): Promise<void> {
        const ext = this.extname(id)
        const base = this.basename(id)
        const last = base + "_" + generations + ext
        if (await this.store.queryObject(last)) {
            const now = DateTime.fromJSDate(new Date())
            const datestring = now.toFormat('yyyy-LL-dd')
            const dailybackup = base + "_" + datestring + ext
            if (await this.store.queryObject(dailybackup)) {
                await this.store.removeObject(dailybackup)
            } else {
                await this.store.renameObject(last, dailybackup)
            }
        }
        for (let i = generations - 1; i > 0; i--) {
            const check = base + "_" + i + ext
            if (await this.store.queryObject(check)) {
                await this.store.renameObject(check, base + "_" + (i + 1).toString() + ext)
            }
        }
        if (await this.store.queryObject(id)) {
            await this.store.renameObject(id, base + "_1" + ext)
        }
    }

}

export const storeFactory = new StoreFactory()
