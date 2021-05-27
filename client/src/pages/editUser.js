// components
import Header from "components/header/header";
import UpdUserMainForm from "components/user/updUserMainForm";
import UpdUserAvatarForm from "components/user/updUserAvatarForm";
// mui components
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
// mui styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	edit_user_root: {
		width: "100%",
		height: "100vh",
	},
	edit_user_divider: {
		padding: 1,
		background: "#02a8cc",
	},
}));

const EditUser = (props) => {
	const classes = useStyles();

	return (
		<Box component="div" classes={{ root: classes.edit_user_root }}>
			<Header title="Edit User" linkPath="/" />
			<UpdUserMainForm />
			<Divider classes={{ root: classes.edit_user_divider }} />
			<UpdUserAvatarForm />
		</Box>
	);
};

export default EditUser;
