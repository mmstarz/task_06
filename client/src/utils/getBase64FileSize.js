// You can calculate the file size (in bytes) using below formula:
// 		x = (n * (3/4)) - y

// Where:
// 		1. x is the size of a file in bytes
// 		2. n is the length of the Base64 String
// 		3. y will be 2 if Base64 ends with '==' and 1 if Base64 ends with '='

export const getBase64FileSize = (base64) => {
	let y = 0;
	if (base64.endsWith("=")) {
		y = 1;
	} else if (base64.endsWith("==")) {
		y = 2;
	}

	return base64.length * (3 / 4) - y;
};
