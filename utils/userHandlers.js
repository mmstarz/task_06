// env
const keys = require("../config/keys");
const CLOUD_AVATARS_FOLDER = keys.cloudAvatarsFolder;
// images handlers
const cloudinary = require("./cloudinary");
const { resizeBase64 } = require("./resizeBase64");

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		USER   PICTURE   HANDLER		%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const pictureHandler = (id, base64string, User) => {
	return new Promise(async (resolve, reject) => {
		try {
			// find user doc
			const user = await User.findOne({ _id: id }).select("avatar");

			// doc check
			if (!(user instanceof User)) {
				throw new Error("Product doc not found");
			}

			// resize base64
			const resized = await resizeBase64(base64string);

			// form folder path
			const folder = CLOUD_AVATARS_FOLDER + "/" + id;

			// Upload image to cloudinary
			const result = await cloudinary.uploader.upload(resized, {
				folder,
				unique_filename: true,
			});

			if (!result) {
				throw new Error("Cloudinary internal error");
			}

			// remove previous picture if exists
			if (user.avatar.id.length > 0 && user.avatar.url.length > 0) {
				await cloudinary.uploader.destroy(product.picture.id);
			}

			// console.log("result: ", result);
			// {
			// 	asset_id: "...",
			// 	public_id: "...",
			// 	signature: "...",
			// 	url: "...",
			// 	secure_url: "...",
			// 	...
			// }

			// {id: public_id, url: secure_url}
			resolve({ id: result.public_id, url: result.secure_url });
		} catch (err) {
			reject(new Error(err.message + " (pictureHandler)"));
		}
	});
};

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		OBJECT  FIELDS  HANDLER			%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const emptyObjectCheck = (obj) => {
	return new Promise((resolve, reject) => {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				// not empty
				resolve(true);
			}
		}

		// is empty
		reject(new Error("Nothing to update"));
	});
};

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		USER   UPDATE   HANDLER			%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const formUpdateFields = (inputs, User) => {
	return new Promise(async (resolve, reject) => {
		try {
			// name: string
			// surname: string
			// description: string
			// avatar: string

			if (typeof inputs.id !== "string" || inputs.id.length === 0) {
				throw new Error("User id  is not defined");
			}

			// set fields
			const fields = [{ id: inputs.id }, {}];

			// name check
			if (typeof inputs.name === "string" && inputs.name.length > 0) {
				fields[1]["name"] = inputs.name;
			}

			// surname check
			if (
				typeof inputs.surname === "string" &&
				inputs.surname.length > 0
			) {
				fields[1]["surname"] = inputs.surname;
			}

			// description check
			if (
				typeof inputs.description === "string" &&
				inputs.description.length > 0
			) {
				fields[1]["description"] = inputs.description;
			}

			// avatar check
			if (typeof inputs.avatar === "string" && inputs.avatar.length > 0) {
				// avatar handler
				const picture = await pictureHandler(
					inputs.id,
					inputs.avatar,
					User
				);

				fields[1]["avatar"] = picture;
			}

			// check fields
			await emptyObjectCheck(fields[1]);

			resolve(fields);
		} catch (err) {
			reject(new Error(err.message + " (formUpdateFields)"));
		}
	});
};

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%		USERS   LIST   HANDLER			%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const usersListHandler = (skip, limit, User) => {
	return new Promise(async (resolve, reject) => {
		try {
			// get data
			const data = await User.aggregate([
				{
					$facet: {
						stage1: [{ $count: "count" }],
						stage2: [
							{ $skip: skip },
							{ $limit: limit },
							{ $sort: { createdAt: 1 } },
						],
					},
				},
				// deconstruct stage1 array
				{ $unwind: "$stage1" },
				//output projection
				{
					$project: {
						count: "$stage1.count",
						current: "$stage2",
					},
				},
			]);

			// data result check
			if (!Array.isArray(data) || data.length === 0) {
				throw new Error("Users not found");
			}

			// data - [{count, current}]
			resolve(data[0]);
		} catch (err) {
			reject(new Error(err.message + " (usersListHandler)"));
		}
	});
};

module.exports = {
	formUpdateFields,
	usersListHandler,
};
