const express = require("express");
var router = express.Router();
const ContactModel = require("../models/contactModel");
const authMiddleware = require("../middlewares/middleware");
var ObjectId = require('mongodb').ObjectID;

router.get("/", (req, res) => {
	ContactModel.find((err, docs) => {
		if (!err) {
			res.status(200).json({
				error: null,
				data: docs,
			});
		} else {
			res.status(400).json({
				error: err,
				data: null,
			});
		}
	});
});

router.get("/:id", (req, res) => {
	ContactModel.findOne({ "_id": new ObjectId(req.params.id) }, (err, doc) => {
		if (!err) {
			res.status(200).json({
				error: null,
				data: doc,
			});
		} else {
			res.status(400).json({
				error: err,
				data: null,
			});
		}
	});
});

router.post("/", [authMiddleware], (req, res) => {
	ContactModel.findOne({ "_id": new ObjectId(req.body.id) }, (err, doc) => {
		if (!err && !doc) {
			insertContact(req, res);
		} else {
			updateStatusContact(req, res);
		}
	});
});

function insertContact(req, res) {
	var contact = new ContactModel();
	contact.name = req.body.name;
	contact.phone = req.body.phone;
	contact.address = req.body.address;
	contact.content = req.body.content;
	contact.status = req.body.status;
	contact.save((err, doc) => {
		if (!err)
			res.status(200).json({
				error: null,
				data: doc,
			});
		else {
			res.status(400).json({
				error: err,
				data: null,
			});
		}
	});
}

function updateStatusContact(req, res) {
	ContactModel.findOneAndUpdate(
		{ status: req.body.status },
		req.body,
		{ new: true },
		(err, doc) => {
			if (!err) {
				res.status(200).json({
					error: null,
					data: doc,
				});
			} else {
				res.status(400).json({
					error: err,
					data: null,
				});
			}
		}
	);
}

router.get("/delete/:id", [authMiddleware], (req, res) => {
	ContactModel.findOneAndRemove({ "_id": new ObjectId(req.params.id) }, (err) => {
		if (!err) {
			res.status(200).json({
				error: null,
				data: "delete done!",
			});
		} else {
			console.log("Delete error :" + err);
		}
	});
});

module.exports = router;
