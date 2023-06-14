const { model, Schema } = require('mongoose')

const setupSchema = new Schema({
    UserID: String,
    Pass: {
        type: String,
        maxLength: 80
    },
    Key: {
        type: String,
        maxLength: 80
    },
    DailyJournal: Object,
    MoodChart: Object
}, { minimize: false })

module.exports = model('journal-entries', setupSchema, 'journal-entries')