import { StoreFactory } from './store-factory';
import * as Minio from 'minio'
import config from 'config'
import { Crypter } from '@rgwch/simple-crypt'

const bucketname = "novels"
let minio: Minio.Client

export class S3Store implements IStore {

    constructor(cfg) {
        minio = new Minio.Client(cfg)
    }
    async renameObject(id: string, newId: string): Promise<void> {
        const cp = await minio.copyObject(bucketname, newId, "/" + bucketname + "/" + id, null)
        const del = await minio.removeObject(bucketname, id)
    }
    createStorable(id: string, passphrase: string): IStorable {
        return new S3StoreObject(id, passphrase)
    }

    removeObject(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            minio.removeObject(bucketname, id, err => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })

    }
    listObjects(pat = /.*/): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const ret = []
            const stream = minio.listObjectsV2(bucketname, "", false, "")
            stream.on('data', elem => {
                ret.push(elem)
            })
            stream.on('error', err => {
                reject(err)
            })
            stream.on('end', () => {
                resolve(ret.map(r => r.name).filter(n => n.match(pat)))
            })
        })
    }
    async queryObject(id: string): Promise<boolean> {
        const find = await this.listObjects(new RegExp(id))
        if (find.length) {
            return true
        } else {
            return false;
        }
    }

}
export class S3StoreObject implements IStorable {
    private crypter: Crypter

    constructor(private id: string, pwd: string) {
        const salt = config.has('salt') ? config.get('salt') : 'someSalt'
        this.crypter = new Crypter(pwd, salt.toString())
    }
    setPassword(pwd: string) {
        this.crypter.setPassword(pwd)
    }

    async save(data_Buffer: Buffer): Promise<void> {
        const encrypted = await this.crypter.encryptBuffer(data_Buffer)
        await minio.putObject(bucketname, this.id, encrypted)
    }
    load(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            let bufs: Array<Buffer> = []
            minio.getObject(bucketname, this.id, (err, data) => {
                if (err) {
                    reject(err)
                }
                if (!data) {
                    reject("no data")
                }
                data.on('data', chunk => {
                    bufs.push(chunk)
                })
                data.on('end', async () => {
                    const ret = Buffer.concat(bufs)
                    const decrypted = await this.crypter.decryptBuffer(ret)
                    resolve(ret)
                })
                data.on("error", err => {
                    reject(err)
                })
            })
        })
    }

}


