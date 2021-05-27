// mui components
import Box from "@material-ui/core/Box";
// mui icons
import StarBorderIcon from "@material-ui/icons/StarBorder";
// styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	wrapper: {
		color: "#FF5722",
		background: "#263238",
		borderRadius: "50%",
		"& svg": {
			marginTop: 2,
			marginLeft: 2,
			marginRight: 2,
			width: "5rem",
			height: "5rem",
		},
		animation: `$spin 1000ms ${theme.transitions.easing.easeInOut} infinite`,
	},
	"@keyframes spin": {
		"0%": {
			transform: "rotateY(0deg) rotateZ(0deg)",
			boxShadow: "#FF5722 0px 0px 0px 0px",
		},
		"50%": {
			transform: "rotateY(180deg) rotateZ(180deg)",
			boxShadow: "#FF5722 0px 0px 4px 4px",
		},
		"100%": {
			transform: "rotateY(360deg) rotateZ(360deg)",
			boxShadow: "#FF5722 0px 0px 2px 2px",
		},
	},
}));

const Spinner = () => {
	const classes = useStyles();

	return (
		<Box className={classes.wrapper}>
			<StarBorderIcon />
		</Box>
	);
};

export default Spinner;
