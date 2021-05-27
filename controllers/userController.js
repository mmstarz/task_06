const { ValidationError } = require("yup");
// models
const User = require("../models/user");
// rules
const {
	addUserRule,
	updUserRule,
	remUserRule,
	getUsersRule,
} = require("../rules/userRules");
// utils
const { formUpdateFields, usersListHandler } = require("../utils/userHandlers");

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		  	  ADD   USER				%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

exports.addUser = async (req, res, next) => {
	try {
		// inputs check
		const inputsRes = await addUserRule.validate(
			{
				name: req.body.name,
				surname: req.body.surname,
				description: req.body.description,
			},
			{ abortEarly: false }
		);

		const { name, surname, description } = inputsRes;

		// create new user doc
		const user = new User({ name, surname, description });

		// store new user doc
		await user.save();

		return res.json(user);
	} catch (err) {
		if (err instanceof ValidationError) {
			return res.status(400).send(err.message + " (addUser)");
		}

		return res.status(500).send(err.message + " (addUser)");
	}
};

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		  	  UPDATE   USER				%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

exports.updUser = async (req, res, next) => {
	try {	

		// inputs check
		const inputsRes = await updUserRule.validate(
			{
				id: req.params.id,
				name: req.body.name,
				avatar: req.body.avatar,
				surname: req.body.surname,
				description: req.body.description,
			},
			{ abortEarly: false }
		);

		// form update fields
		const fields = await formUpdateFields(inputsRes, User);

		// update document
		const updUser = await User.findOneAndUpdate(
			{ _id: fields[0].id },
			{ $set: fields[1] },
			{ new: true }
		);

		return res.json(updUser);
	} catch (err) {
		if (err instanceof ValidationError) {
			return res.status(400).send(err.message + " (updUser)");
		}

		return res.status(500).send(err.message + " (updUser)");
	}
};

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		  	  REMOVE   USER				%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

exports.remUser = async (req, res, next) => {
	try {		
		// args check
		const argsRes = await remUserRule.validate({
			id: req.params.id,
		});		

		// remove product doc
		await User.findOneAndRemove({ _id: argsRes.id });

		// avatar picture deletion
		// is handled by mongoose middleware
		// at user schema

		return res.json({ msg: "removed successfully" });
	} catch (err) {
		if (err instanceof ValidationError) {
			return res.status(400).send(err.message + " (remUser)");
		}

		return res.status(500).send(err.message + " (remUser)");
	}
};

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		  GET   USERS   LIST			%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

exports.getUsers = async (req, res, next) => {
	try {		
		// args check
		const argsRes = await getUsersRule.validate(
			{
				skip: req.params.skip,
				limit: req.params.limit,
			},
			{ abortEarly: false }
		);

		const { skip, limit } = argsRes;		

		const data = await usersListHandler(skip, limit, User);

		return res.json(data);
	} catch (err) {
		if (err instanceof ValidationError) {
			return res.status(400).send(err.message + " (getUsers)");
		}

		return res.status(500).send(err.message + " (getUsers)");
	}
};
