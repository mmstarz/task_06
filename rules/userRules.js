const yup = require("yup");

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		  VALIDATE  FILE  SIZE 			%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const AVAILABLE_FILE_SIZE = 5000000;

// You can calculate the file size (in bytes) using below formula:
// 		x = (n * (3/4)) - y

// Where:
// 		1. x is the size of a file in bytes
// 		2. n is the length of the Base64 String
// 		3. y will be 2 if Base64 ends with '==' and 1 if Base64 ends with '='

const getBase64FileSize = (base64) => {
	let y = 0;
	if (base64.endsWith("=")) {
		y = 1;
	} else if (base64.endsWith("==")) {
		y = 2;
	}

	return base64.length * (3 / 4) - y;
};

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		VALIDATE  BASE64  STRING		%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const isValidBase64 = (base64string) => {
	try {		
		const buffer = Buffer.from(base64string, "base64");		

		const isEncoded = buffer.toString("base64") ===	base64string;
		console.log("isEncoded: ", isEncoded);

		return isEncoded;
	} catch (err) {
		console.log("isValidBase64 error: ", err);
		// something failed
		return false;
	}
};

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		  VALIDATE  FILE  TYPE 			%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const signatures = {
	"/9j/4AAQSkZJRgABAQ": "image/jpeg",
	"w7/DmMO/w6AuLkpGDQpJRi4=": "image/jpg",
	"w7/DmMO/w6EuLkV4DQppZi4=": "image/jpg",
	"w7/DmMO/w6guLlNQDQpJRkYu": "image/jpg",
	R0lGODdh: "image/gif",
	R0lGODlh: "image/gif",
	"Qk0=": "image/bmp",
	iVBORw0KGgo: "image/png",
	"4oCwUE5HLi4uLg==": "image/png",
};

// check for base64 image files
const isValidBase64FileType = (base64) => {
	if (
		base64.startsWith("data:image/jpeg;base64,") ||
		base64.startsWith("data:image/jpg;base64,") ||
		base64.startsWith("data:image/gif;base64,") ||
		base64.startsWith("data:image/bmp;base64,") ||
		base64.startsWith("data:image/png;base64,")
	) {
		// valid mimetype
		return true;
	} else if (base64.split(",").length > 1) {
		// some other mimetype
		return false;
	} else if (base64.split(",").length === 1) {
		// no mimetype -> check signature
		for (let key in signatures) {
			// valid signature
			if (base64.indexOf(key) === 0) {
				return true;
			}
		}
		// invalid signature
		return false;
	} else {
		return false;
	}
};

// signatures list
// https://www.garykessler.net/library/file_sigs.html

// string => base64 encode
// http://string-functions.com/base64encode.aspx

// FILE TYPE                    ENCODED SIGNATURE
// _________                    _________________

// JPEG                         /9j/4AAQSkZJRgABAQ

// JFIF, JPE, JPEG, JPG			w7/DmMO/w6AuLkpGDQpJRi4=

// JPG  						w7/DmMO/w6EuLkV4DQppZi4=
// JPG 							w7/DmMO/w6guLlNQDQpJRkYu

// GIF                          R0lGODdh
// GIF 							R0lGODlh

// BMP                          Qk0=

// PNG 							4oCwUE5HLi4uLg==
// PNG 							iVBORw0KGgo

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%			ADD   USER   RULE			%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const addUserRule = yup.object().shape({
	name: yup
		.string("Name must be of type string")
		.min(2, "Name should be of minimum 2 characters length")
		.required("Name is required"),
	surname: yup
		.string("Surname must be of type string")
		.min(2, "Surname should be of minimum 2 characters length")
		.required("Surname is required"),
	description: yup
		.string("Description must be of type string")
		.min(8, "Description be of minimum 8 characters length")
		.required("Description is required"),	
});

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		UPDATE   USER   RULE			%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const updUserRule = yup.object().shape({
	id: yup
		.string("User id must be of type string")
		.trim()
		.required("User id is required"),
	name: yup
		.string("Name must be of type string")
		.min(2, "Name should be of minimum 2 characters length")
		.oneOf([yup.ref("name"), undefined]),
	surname: yup
		.string("Surname must be of type string")
		.min(2, "Surname should be of minimum 2 characters length")
		.oneOf([yup.ref("surname"), undefined]),
	description: yup
		.string("Description must be of type string")
		.min(8, "Description should be of minimum 8 characters length")
		.oneOf([yup.ref("description"), undefined]),	
	avatar: yup
		.string("Picture must be of type string")		
		.test(
			"FILE_FORMAT",
			"Uploaded file has unsupported format",
			(value) => !value || (value && isValidBase64FileType(value))
		)
		.test(
			"FILE_SIZE",
			"Uploaded file is of invalid size",
			(value) =>
				!value ||
				(value && getBase64FileSize(value) < AVAILABLE_FILE_SIZE)
		)
		.oneOf([yup.ref("avatar"), undefined]),		
});

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		REMOVE   USER   RULE			%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const remUserRule = yup.object().shape({
	id: yup
		.string("User id must be of type string")
		.trim()
		.required("User id is required"),
});

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		GET   USERS   LIST   RULE		%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const getUsersRule = yup.object().shape({
	skip: yup
		.number("Skip must be of type number")
		.integer("Skip number must be integer")
		.nullable(),
	limit: yup
		.number("Limit must be of type number")
		.integer("Limit number must be integer"),
});

module.exports = {
	addUserRule,
	updUserRule,
	remUserRule,	
	getUsersRule,
};
