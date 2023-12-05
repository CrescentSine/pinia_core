'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/pinia-core.prod.cjs')
} else {
  module.exports = require('./dist/pinia-core.cjs')
}
