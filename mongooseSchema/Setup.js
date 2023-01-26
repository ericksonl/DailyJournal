const { model, Schema }  = require('mongoose')

const setupSchema = new Schema({
    Guild: String,
    // User: int64,
    Baseline: Array
})

module.exports = model('journal-entries', setupSchema, 'journal-entries')