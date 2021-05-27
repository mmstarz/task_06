const sharp = require("sharp");

/*%%%=======================================%%%*/
/*%%%										%%%*/
/*%%%	RESIZE 	BASE64STRING  HANDLER		%%%*/
/*%%%										%%%*/
/*%%%=======================================%%%*/

const resizeHandler = (base64string, maxHeight = 200, maxWidth = 200) => {
	return new Promise(async (resolve, reject) => {
		try {
			const destructImage = base64string.split(";");
			const mimeType = destructImage[0].split(":")[1];
			const imageData = destructImage[1].split(",")[1];

			let resizedImage = Buffer.from(imageData, "base64");

			resizedImage = await sharp(resizedImage)
				.resize({ width: maxWidth, height: maxHeight, fit: "fill" })
				.toBuffer();

			resolve(
				`data:${mimeType};base64,${resizedImage.toString("base64")}`
			);
		} catch (err) {
			reject(new Error(err.message + " (resizeHandler)"));
		}
	});
};

module.exports = { resizeBase64: resizeHandler };
