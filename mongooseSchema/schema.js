const { model, Schema } = require('mongoose')

const setupSchema = new Schema({
    UserID: String,
    Key: {
        type: String,
        maxLength: 80
    },
    DailyJournal: Object
}, { minimize: false })

module.exports = model('journal-entries', setupSchema, 'journal-entries')