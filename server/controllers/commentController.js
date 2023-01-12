const express = require("express");
var router = express.Router();
const CommentModel = require("../models/commentModel");
const authMiddleware = require("../middlewares/middleware");

router.get("/", (req, res) => {
	CommentModel.find((err, docs) => {
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

router.get("/:address", (req, res) => {
	CommentModel.find({ address: req.params.address }, (err, doc) => {
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
	CommentModel.findOne({ "_id": req.body._id }, (err, doc) => {
		if (!err && !doc) {
			insertContact(req, res);
		} else {
			updateStatusContact(req, res);
		}
	});
});

function insertContact(req, res) {
	var contact = new CommentModel();
	contact.name = req.body.name;
	contact.address = req.body.address;
	contact.content = req.body.content;
	contact.time = req.body.time;
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
	CommentModel.findOneAndUpdate(
		{ "_id": req.body._id },
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
	CommentModel.findOneAndRemove({ "_id": req.params.id }, (err) => {
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
