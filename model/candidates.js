const mongoose = require('mongoose')

const CandSchema = new mongoose.Schema(
    {
        Name: { type: String, required: true},
        ID: { type: String, required: true, unique: true},
        Department: { type: String, required: true},
        Votes: {type: Number, default: 0}
    },     
    {collection: 'candidates' }
)

const model = mongoose.model('CandSchema', CandSchema)

module.exports= model