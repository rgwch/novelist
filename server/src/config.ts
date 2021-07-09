import os from 'os'
import fs from 'fs'

const help="Hilfe"
export const config = {
  basedir: "/srv/ownCloud/synced/dox",
  salt: "someRandomString",
  novel: undefined,
  resolveDir: () => {
    console.log(help)
    console.log(config.basedir)
    console.log(fs.existsSync(config.basedir))
    let ret = os.homedir()
    if (process.env.NOVELS_DIR && fs.existsSync(process.env.NOVELS_DIR)) {
      ret = process.env.NOVELS_DIR
    }
    if (config.basedir && fs.existsSync(config.basedir)) {
      ret = config.basedir
    }
    return ret
  }
}