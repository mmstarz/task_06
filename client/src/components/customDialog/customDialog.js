import { useCallback } from "react";
import PropTypes from "prop-types";
// components
import Dialog from "components/widgets/dialog/dialogSlide";
// mui components
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from '@material-ui/core/IconButton';
// mui icons
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
// styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	dialogTitle: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
		"& svg": {
			width: "2rem",
			height: "2rem",
			color: "#e91e63",
		},
		"& h6": {
			marginLeft: theme.spacing(1),
			fontWeight: 600,
		},
	},	
	dialogActions: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-around",
		"& .btn_submit": {
			color: "#43a047",
			"&.Mui-disabled": {
				color: "rgba(0, 0, 0, 0.26)",
			},
		},
		"& .btn_cancel": {
			color: "#e91e63",
			"&.Mui-disabled": {
				color: "rgba(0, 0, 0, 0.26)",
			},
		},
	},
}));

const CustomDialog = ({ show, handleCancel, handleSubmit, title, msg }) => {
	const classes = useStyles();

	const dialogTitle = (
		<Box component="div" classes={{ root: classes.dialogTitle }}>
			<DeleteOutlinedIcon />
			<Typography variant="subtitle1">{title}</Typography>
		</Box>
	);

	const dialogContent = (
		<Box component="div">
			<Typography variant="body1">{msg}</Typography>
		</Box>
	);

	const customHandleSubmit = useCallback(() => {
		handleSubmit();
		handleCancel();
	}, [handleSubmit, handleCancel])

	const dialogActions = (
		<Box component="div" classes={{ root: classes.dialogActions }}>
			<Tooltip title="Cancel">
				<IconButton
					aria-label="Cancel"
					component="span"
					color="inherit"
					className="btn_cancel"
					onClick={handleCancel}
				>
					<CloseOutlinedIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="Submit">
				<IconButton
					aria-label="Submit"
					component="span"
					color="inherit"
					className="btn_submit"
					onClick={customHandleSubmit}
				>
					<DoneOutlinedIcon />
				</IconButton>
			</Tooltip>
		</Box>
	);

	return (
		<Dialog
			open={show}
			handleClose={handleCancel}
			title={dialogTitle}
			content={dialogContent}
			actions={dialogActions}
		/>
	);
};

CustomDialog.propTypes = {
	msg: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	handleCancel: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
};

export default CustomDialog;
