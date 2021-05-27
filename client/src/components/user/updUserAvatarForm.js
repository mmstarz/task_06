import { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
// router
import { useParams } from "react-router-dom";
// redux
import { connect } from "react-redux";
import { updUser } from "store/actions/usersActions";
// formik & yup
import { useFormik } from "formik";
import * as yup from "yup";
// base64 validators
import { isValidBase64 } from "utils/isValidBase64";
import { isValidBase64FileType } from "utils/isValidBase64FileType";
import { getBase64FileSize } from "utils/getBase64FileSize";
// mui components
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
// mui icons
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";

import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import PlaylistAddCheckOutlinedIcon from "@material-ui/icons/PlaylistAddCheckOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
// mui styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	upd_user_avatar_wrapper: {
		width: "100%",
		padding: theme.spacing(1),
		"& .header": {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			"& .title": {
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-start",
				margin: theme.spacing(2, 0),
				"& svg": {
					width: "2rem",
					height: "2rem",
					marginRight: theme.spacing(0.5),
				},
				"& p": {
					fontSize: "1.15rem",
				},
			},
			"& .actions": {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				"& .btn_edit": {
					color: "inherit",
				},
				"& .btn_cancel": {
					color: "#d81b60",
				},
				"& .btn_submit": {
					color: "#00897b",
					"&.Mui-disabled": {
						color: "rgba(0, 0, 0, 0.26)",
						backgroundColor: "transparent",
					},
				},
			},
		},
		"& .divider": {
			width: "100%",
		},
		"& .data_container": {
			width: "100%",
			"& .current": {
				margin: theme.spacing(2, 0),
			},
			"& .form_wrapper": {
				margin: theme.spacing(2, 0),
				"& .form": {
					position: "relative",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					"& .upload_input": {
						display: "none",
					},
					"& .upload_label": {
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						"& .upload_btn": {
							color: "#9c27b0",
							filter: `
    							drop-shadow(0px 0px 1px #00bcd4)
    							drop-shadow(0px 0px 2px #55e0bc)
    							drop-shadow(0px 0px 3px #91dfe6)`,
							"& svg": {
								width: "3rem",
								height: "3rem",
							},
						},
					},
				},
			},
			"& .error_wrapper": {
				margin: theme.spacing(1),
				"& .error_message": {
					color: "#e91e63",
					fontSize: "small",
					textAlign: "center",
				},
			},
		},
	},
	photo: {
		width: 200,
		height: 200,
		margin: "auto",
		"& img": {
			objectFit: "fill",
		},
		"@media (min-width: 300px)": {
			width: 280,
			height: 280,
		},
		"@media (min-width: 320px)": {
			width: 300,
			height: 300,
		},
	},
}));

const FILE_SIZE = 5000000;

const validationSchema = yup.object({
	avatar: yup
		.string()
		.nullable()
		.notRequired()
		.test(
			"VALID_FILE",
			"Invalid file",
			(value) => !value || (value && isValidBase64(value))
		)
		.test(
			"FILE_FORMAT",
			"Uploaded file has unsupported format.",
			(value) => !value || (value && isValidBase64FileType(value))
		)
		.test(
			"FILE_SIZE",
			"Invalid file size.",
			(value) => !value || (value && getBase64FileSize(value) < FILE_SIZE)
		),
});

const UpdUserAvatarForm = ({ current, updUser }) => {
	const classes = useStyles();

	const { id } = useParams();
	const avatar = useMemo(() => {
		const index = current.findIndex((user) => user._id === id);
		return current[index].avatar;
	}, [id, current]);

	const [edit, setEdit] = useState(false);
	const [typed, setTyped] = useState(false);
	const [imageFile, setImageFile] = useState({
		base64: "",
		preview: avatar.url,
	});

	const formik = useFormik({
		enableReinitialize: true,
		validateOnChange: true,
		validateOnBlur: true,
		initialValues: {
			avatar: imageFile.base64,
		},
		validationSchema: validationSchema,
		onSubmit: async (values, { resetForm }) => {
			// console.log("avatar: ", values.avatar);

			// store variables
			const variables = {
				avatar: values.avatar,
			};

			// clear
			setTyped(false);
			setEdit(false);
			resetForm();

			try {
				// send redux action
				updUser(id, variables);
			} catch (err) {
				return err;
			}
		},
	});

	const { handleSubmit, resetForm, errors } = formik;

	const handleCancelEdit = useCallback(() => {
		setTyped(false);
		setEdit(false);
		setImageFile({
			base64: "",
			preview: avatar.url,
		});
		resetForm();
	}, [resetForm, avatar]);

	const handleImageURL = useCallback((file) => {
		if (typeof file !== "undefined" && window.webkitURL) {
			return window.webkitURL.createObjectURL(file);
		}

		if (typeof file !== "undefined" && window.URL) {
			return window.URL.createObjectURL(file);
		}

		return "";
	}, []);

	const handleImageChange = useCallback(
		({
			target: {
				validity,
				files: [file],
			},
		}) => {
			if (validity.valid && typeof file !== "undefined") {
				const imageSrc = handleImageURL(file);

				let reader = new FileReader();

				reader.readAsDataURL(file);

				reader.onloadend = () => {
					setImageFile({
						base64: reader.result,
						preview: imageSrc,
					});
					setTyped(true);
				};

				reader.onerror = (err) => {
					console.log("Reader error: ", err);
				};
			}
		},
		[handleImageURL]
	);

	// console.log("errors: ", errors);

	const errCondition = typed && errors["avatar"] ? true : false;
	const errorMessage = errors["avatar"];
	const validCondition = edit && typed && !errCondition;

	const renderForm = useCallback(() => {
		return (
			<form className="form" noValidate autoComplete="off">
				<TextField
					id="upload_picture"
					label="Upload picture"
					className="upload_input"
					name="avatar"
					type="file"
					InputProps={{
						accept: "image/*",
					}}
					onChange={handleImageChange}
				/>
				<Avatar
					variant="rounded"
					src={imageFile.preview}
					classes={{ root: classes.photo }}
				/>
				<label htmlFor="upload_picture" className="upload_label">
					<Tooltip title="Select picture">
						<IconButton
							aria-label="Select picture"
							component="span"
							className="upload_btn"
						>
							<ImageOutlinedIcon />
						</IconButton>
					</Tooltip>
				</label>
			</form>
		);
	}, [handleImageChange, imageFile, classes]);

	return (
		<Box
			component="div"
			classes={{ root: classes.upd_user_avatar_wrapper }}
		>
			<Box component="div" className="header">
				<Box component="div" className="title">
					<ImageOutlinedIcon />
					<Typography variant="body1">Avatar</Typography>
				</Box>
				<Box component="div" className="actions">
					{!edit && (
						<Tooltip title="Change avatar">
							<IconButton
								className="btn_edit"
								aria-label="Change avatar"
								component="span"
								onClick={() => setEdit(true)}
							>
								<EditOutlinedIcon />
							</IconButton>
						</Tooltip>
					)}
					{edit && (
						<Tooltip title="Cancel change">
							<IconButton
								className="btn_cancel"
								aria-label="Cancel change"
								component="span"
								onClick={handleCancelEdit}
							>
								<ClearOutlinedIcon />
							</IconButton>
						</Tooltip>
					)}
					{edit && (
						<Tooltip title="Submit change">
							<IconButton
								className="btn_submit"
								aria-label="Submit change"
								component="span"
								onClick={handleSubmit}
								disabled={!validCondition}
							>
								<PlaylistAddCheckOutlinedIcon />
							</IconButton>
						</Tooltip>
					)}
				</Box>
			</Box>
			<Divider className="divider" />
			<Box component="div" className="data_container">
				{!edit && (
					<Box component="div" className="current">
						<Avatar
							variant="rounded"
							src={avatar.url}
							classes={{ root: classes.photo }}
						/>
					</Box>
				)}
				{edit && (
					<Box component="div" className="form_wrapper">
						{renderForm()}
					</Box>
				)}
				{errCondition && (
					<Box component="div" className="error_wrapper">
						<Typography variant="body1" className="error_message">
							{errorMessage}
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
};

UpdUserAvatarForm.propTypes = {
	current: PropTypes.array.isRequired,
	updUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	return {
		current: state.users.current,
	};
};

export default connect(mapStateToProps, { updUser })(UpdUserAvatarForm);
