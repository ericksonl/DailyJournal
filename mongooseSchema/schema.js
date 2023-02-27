const { model, Schema } = require('mongoose')

const setupSchema = new Schema({
    UserID: String,
    Key: String,
    DailyJournal: Object
}, { minimize: false })

module.exports = model('journal-entries', setupSchema, 'journal-entries')