const { model, Schema }  = require('mongoose')

const setupSchema = new Schema({
    UserID: String,
    Key: String,
    DailyJournal: Array
})

module.exports = model('journal-entries', setupSchema, 'journal-entries')