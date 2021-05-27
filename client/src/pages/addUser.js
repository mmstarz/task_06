// components
import Header from "components/header/header";
import AddUserForm from "components/user/addUserForm";
// mui components
import Box from "@material-ui/core/Box";
// mui styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	add_user_root: {
		width: "100%",
		height: "100vh",		
	},
}));

const AddUser = (props) => {
	const classes = useStyles();

	return (
		<Box component="div" classes={{ root: classes.add_user_root }}>
			<Header title="Add User" linkPath="/" />
			<AddUserForm />
		</Box>
	);
};

export default AddUser;
