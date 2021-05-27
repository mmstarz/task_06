// prop-types
import PropTypes from "prop-types";
// mui components
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
// mui styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(1),
		"& p": {
			textAlign: "center",
		},
	},
}));

const Notification = ({ msg }) => {
	const classes = useStyles();

	return (
		<Box component="div" classes={{ root: classes.root }}>
			<Typography variant="body1" paragraph gutterBottom>
				{msg}
			</Typography>
		</Box>
	);
};

Notification.propTypes = {
	msg: PropTypes.string.isRequired,
};

export default Notification;
