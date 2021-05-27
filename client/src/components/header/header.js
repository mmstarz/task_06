import { useMemo } from "react";
// router
import { Link } from "react-router-dom";
// mui components
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
// mui icons
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
// styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	tool_board: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: theme.spacing(1, 1, 1, 2),
	},
	subtitle1: {
		fontWeight: 600,
	},
	divider: {
		padding: 1,
		background: "#02a8cc",
	},
}));

const Header = ({ title, linkPath }) => {
	const classes = useStyles();

	const headerButton = useMemo(() => {
		switch (linkPath) {
			case "/addUser":
				return (
					<Tooltip title="Add new user">
						<IconButton
							aria-label="Add new user"
							component={Link}
							to="/addUser"
							color="inherit"
						>
							<AddOutlinedIcon />
						</IconButton>
					</Tooltip>
				);
			default:
				return (
					<Tooltip title="Back to main">
						<IconButton
							aria-label="Back to main"
							component={Link}
							to="/"
							color="inherit"
						>
							<ArrowBackOutlinedIcon />
						</IconButton>
					</Tooltip>
				);
		}
	}, [linkPath]);

	return (
		<Paper elevation={0} classes={{ root: classes.root }}>
			<Box component="div" classes={{ root: classes.tool_board }}>
				<Typography
					variant="subtitle1"
					classes={{ subtitle1: classes.subtitle1 }}
				>
					{title}
				</Typography>
				{headerButton}
			</Box>
			<Divider classes={{ root: classes.divider }} />
		</Paper>
	);
};

export default Header;
