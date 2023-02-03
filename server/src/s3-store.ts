import { StoreFactory } from './store-factory';
import Minio from 'minio'
import config from 'config'
import { Crypter } from '@rgwch/simple-crypt'

const bucketname = "novels"
let minio: Minio.Client

export class S3Store implements IStore {

    constructor(cfg) {
        minio = new Minio.Client(cfg)

    }
    createStoreObject(id: string, passphrase: string): IStoreObject {
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
    listObjects(): Promise<string[]> {
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
                resolve(ret)
            })
        })
    }
    queryObject(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

}
export class S3StoreObject implements IStoreObject {
    private crypter: Crypter

    constructor(private id: string, pwd: string) {
        const salt = config.has('salt') ? config.get('salt') : 'someSalt'
        this.crypter = new Crypter(pwd, salt.toString())
    }
    setPassword(pwd: string) {
        throw new Error("Method not implemented.");
    }

    save(data_Buffer: Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            minio.putObject(bucketname, this.id, data_Buffer, (err) => {
                if (err) {
                    reject(err)
                }
            })
            resolve()
        })
    }
    load(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            let bufs: Array<Buffer> = []
            minio.getObject(bucketname, this.id, (err, data) => {
                if (err) {
                    reject(err)
                }
                data.on('data', chunk => {
                    bufs.push(chunk)
                })
                data.on('end', () => {
                    const ret = Buffer.concat(bufs)
                    resolve(ret)
                })
                data.on("error", err => {
                    reject(err)
                })
            })
        })
    }

}


