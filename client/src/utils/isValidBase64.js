export const isValidBase64 = (base64string) => {
	try {
		let isEncoded = atob(btoa(base64string)) === base64string;
		if (!isEncoded) throw new Error("Not encoded string detected");
		return isEncoded;
	} catch (err) {
		// something failed
		return false;
	}
};
