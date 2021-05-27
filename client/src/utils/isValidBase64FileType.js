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
export const isValidBase64FileType = (base64) => {
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
		// no mimetype base64 - check signature
		for (let key in signatures) {
			// valid signature
			if (base64.indexOf(key) === 0) {
				return true;
			}
		}
		// invalid signature
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
