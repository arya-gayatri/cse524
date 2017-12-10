var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PhotoSchema = new Schema({
    photoId: String,
    photoIndex: String,
    assistantInputs: Object,
    MLInputs: Object,
    rawMetadata: Object,
    chosenMetadata: Object,
    photoSource: String,
    isProcessed: Boolean,
    initialTimeStamp: Date,
    isAccessible: Boolean,
    imageURL : String

});
module.exports = mongoose.model('Photo', PhotoSchema);

