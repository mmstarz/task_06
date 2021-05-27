// components
import Spinner from "components/widgets/spinner/spinner";
// mui components
import Box from "@material-ui/core/Box";
// mui styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
}));

const Loading = (props) => {
	const classes = useStyles();

	return (
		<Box component="div" classes={{ root: classes.root }}>
			<Spinner />
		</Box>
	);
};

export default Loading;
