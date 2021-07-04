import fs from 'fs'
import os from 'os'
import config from './config.json'
export default {
  novel: null,

  resolveDir: () => {
    let basedir = os.homedir()
    if (process.env.NOVELS_DIR && fs.existsSync(process.env.NOVELS_DIR)) {
      basedir = process.env.NOVELS_DIR
    }
    if (config['basedir'] && fs.existsSync(config['basedir'])) {
      basedir = config['basedir']
    }
    return basedir
  }
}
