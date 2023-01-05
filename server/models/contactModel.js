const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: false,
	},
	address: {
		type: String,
		required: false,
	},
	content: {
		type: String,
		required: false,
	},
    status: {
		type: Number,
		required: false,
	},
});

const ContactModel = mongoose.model("Contact", ContactSchema);

module.exports = ContactModel;
