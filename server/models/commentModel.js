const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: false,
	},
	content: {
		type: String,
		required: false,
	},
	time: {
		type : Date, 
        default: Date.now,
        required: false,
	},
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
