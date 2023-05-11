import fs from 'fs'
import path from 'path'

const root = fs.realpathSync(process.cwd())
const config = path.resolve(root, 'config')
const packages = path.resolve(root, 'node_modules')
const src = path.resolve(root, 'src')

export default {
  root,
  config: {
    root: config,
    jest: path.resolve(config, 'jest')
  },
  packages,
  app: {
    src,
    entry: path.resolve(src, 'index.js')
  }
}
