const { createRunOncePlugin } = require('@expo/config-plugins')
const packageJson = require('./package.json')
const { withWatermelonDB } = require('./build/withWatermelonDB')

module.exports = createRunOncePlugin(withWatermelonDB, packageJson.name, packageJson.version);