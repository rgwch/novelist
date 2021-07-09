import os from 'os'
import fs from 'fs'

export const config = {
  basedir: "/srv/owncloud/synced/dox",
  salt: "someRandomString",

  // ----------
  novel: undefined,
  resolveDir: () => {
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
