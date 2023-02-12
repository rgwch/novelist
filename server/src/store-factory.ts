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
                throw new Error("Storage configuration not found: " + s)
            }
        } else {
            throw new Error("no storage defined")
        }

    }
    copyObject(id: string, newId: string): Promise<boolean> {
        return this.store.copyObject(id, newId)
    }
    createStorable(id: string, passphrase: string): IStorable {
        return this.store.createStorable(id, passphrase)
    }
    removeObject(id: string): Promise<boolean> {
        return this.store.removeObject(id)
    }
    async removeAll(pattern: RegExp): Promise<number> {
        const files = await this.store.listObjects(pattern)
        for (const file of files) {
            await this.store.removeObject(file)
        }
        return files.length
    }
    listObjects(pat = /.*/): Promise<string[]> {
        return this.store.listObjects(pat)
    }
    queryObject(id: string): Promise<any> {
        return this.store.queryObject(id)
    }
    renameObject(id: string, newId: string): Promise<boolean> {
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
    /**
     * On every call, create a new Version of the object denoted by 'id', up to 'generations' versions.
     * Additionally, move the last kept version in a "today" version.
     * Does NOT store the object itself
     * @param id id of the object to rotate
     * @param generations number of generations to create
     */
    async rotate(id: string, generations: number): Promise<void> {
        const ext = this.extname(id)
        const base = this.basename(id)
        const last = base + "_" + generations + ext
        const exists = await this.store.queryObject(last)
        if (exists) {
            // last version to keep must drop out -> create "today"-Version
            const datestring = DateTime.now().toFormat('yyyy-LL-dd')
            const dailybackup = base + "_" + datestring + ext
            // if today version exists already: remove it
            if (await this.store.queryObject(dailybackup)) {
                await this.store.removeObject(dailybackup)
            }
            // create new today version from last backup
            await this.store.renameObject(last, dailybackup)
        }
        // rotate all backups by 1
        for (let i = generations - 1; i > 0; i--) {
            const check = base + "_" + i + ext
            if (await this.store.queryObject(check)) {
                await this.store.renameObject(check, base + "_" + (i + 1).toString() + ext)
            }
        }
        // save current object to backup #1
        if (await this.store.queryObject(id)) {
            await this.store.copyObject(id, base + "_1" + ext)
        }
    }

}

export const storeFactory = new StoreFactory()
