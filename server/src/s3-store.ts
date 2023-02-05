import * as Minio from 'minio'
import config from 'config'
import { Crypter } from '@rgwch/simple-crypt'

const bucketname = "novels"
let minio: Minio.Client

export class S3Store implements IStore {

    constructor(cfg) {
        minio = new Minio.Client(cfg)
    }
    async renameObject(id: string, newId: string): Promise<boolean> {
        if (!(await this.queryObject(id))) {
            console.log("rename: " + id + " does not exists")
            return false;
        }
        const cp = await minio.copyObject(bucketname, newId, "/" + bucketname + "/" + id, null)
        const del = await minio.removeObject(bucketname, id)
        return true
    }
    createStorable(id: string, passphrase: string): IStorable {
        return new S3StoreObject(id, passphrase)
    }

    async removeObject(id: string): Promise<boolean> {
        if (!(await this.queryObject(id))) {
            console.log("remove: " + id + " does not exists")
            return false;
        }
        await minio.removeObject(bucketname, id)
        return true
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

    constructor(private id: string, pwd: string | Crypter) {
        const salt = config.has('salt') ? config.get('salt') : 'someSalt'
        if (typeof (pwd) == 'string') {
            this.crypter = new Crypter(pwd, salt.toString())
        } else {
            this.crypter = pwd
        }
    }

    setPassword(pwd: string) {
        this.crypter.setPassword(pwd)
    }

    clone(clone_id: string): IStorable {
        return new S3StoreObject(clone_id, this.crypter)
    }

    async save(data_Buffer: Buffer): Promise<boolean> {
        const encrypted = await this.crypter.encryptBuffer(data_Buffer)
        await minio.putObject(bucketname, this.id, encrypted)
        return true
    }
    load(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            let bufs: Array<Buffer> = []
            minio.getObject(bucketname, this.id, (err, stream) => {
                if (err) {
                    reject(err)
                } else {
                    stream.on('data', chunk => {
                        bufs.push(chunk)
                    })
                    stream.on('end', () => {
                        const ret = Buffer.concat(bufs)
                        this.crypter.decryptBuffer(ret).then(decrypted => {
                            resolve(decrypted)
                        })
                    })
                    stream.on("error", err => {
                        reject(err)
                    })
                }
            })
        })
    }

}


