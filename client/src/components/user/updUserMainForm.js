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
// mui compponents
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
// mui icons
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import TextFieldsOutlinedIcon from "@material-ui/icons/TextFieldsOutlined";

import PlaylistAddCheckOutlinedIcon from "@material-ui/icons/PlaylistAddCheckOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
// mui styles
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	upd_user_form_wrapper: {
		width: "100%",
		padding: theme.spacing(1),
		"& .main_fields_header": {
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
		"& .upd_user_form": {
			display: "flex",
			alignItems: "center",
			flexDirection: "column",
			justifyContent: "center",
			maxWidth: 360,
			margin: theme.spacing(1, "auto"),
			"& .form_field": {
				margin: theme.spacing(1, 0),
				padding: theme.spacing(1, 0),
				"&.short": {
					minHeight: 94,
					"@media (max-width: 360px)": {
						minHeight: 113,
					},
				},
				"&.long": {
					minHeight: 217,
					"@media (max-width: 360px)": {
						minHeight: 246,
					},
				},
			},
			"& .form_actions": {
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				width: "100%",
				margin: theme.spacing(1, 0),
				"& .submit": {
					color: "white",
					backgroundColor: "#009688",
					"&.Mui-disabled": {
						color: "#bdbdbd",
						boxShadow: "none",
						backgroundColor: "#546e7a",
					},
					"&:hover": {
						backgroundColor: "#00796b",
					},
				},
				"& .cancel": {
					color: "white",
					backgroundColor: "#E91E63",
					"&.Mui-disabled": {
						color: "#bdbdbd",
						boxShadow: "none",
						backgroundColor: "#546e7a",
					},
					"&:hover": {
						backgroundColor: "#C2185B",
					},
				},
			},
		},
	},
}));

const validationSchema = yup.object({
	name: yup
		.string("Name must be of type string")
		.min(2, "Name should be of minimum 2 characters length")
		.required("Name is required"),
	surname: yup
		.string("Surname must be of type string")
		.min(2, "Surname should be of minimum 2 characters length")
		.required("Surname is required"),
	description: yup
		.string("Description must be of type string")
		.min(8, "Description be of minimum 8 characters length")
		.required("Description is required"),	
});

const UpdUserForm = ({ current, updUser }) => {
	const classes = useStyles();

	const { id } = useParams();
	const fields = useMemo(() => {
		const index = current.findIndex((user) => user._id === id);
		return current[index];
	}, [id, current]);

	const [edit, setEdit] = useState(false);
	const [changed, setChanged] = useState(false);

	const [typed, setTyped] = useState({
		name: false,
		surname: false,
		description: false,
	});

	const formik = useFormik({
		enableReinitialize: true,
		validateOnChange: true,
		validateOnBlur: true,
		initialValues: {
			name: fields.name,
			surname: fields.surname,
			description: fields.description,
		},
		validationSchema: validationSchema,
		onSubmit: async (values, { resetForm }) => {
			// alert(JSON.stringify(values, null, 2));
			// store variables
			const variables = {
				name: values.name,
				surname: values.surname,
				description: values.description,
			};
			// clear
			setTyped({
				name: false,
				surname: false,
				description: false,
			});
			setChanged(false);
			resetForm();

			try {
				// send redux action
				updUser(id, variables);
			} catch (err) {
				return err;
			}
		},
	});

	const {
		values,
		errors,
		isValid,
		resetForm,
		handleBlur,
		handleChange,
		handleSubmit,
	} = formik;

	const customHandleChange = useCallback(
		(event) => {
			setTyped({ ...typed, [event.target.name]: true });
			setChanged(true);
			handleChange(event);
		},
		[handleChange, typed]
	);

	const clearForm = useCallback(() => {
		setTyped({
			name: false,
			surname: false,
			description: false,
		});
		setChanged(false);
		resetForm();
	}, [resetForm]);

	const handleCancelEdit = useCallback(() => {
		clearForm();
		setEdit(false);
	}, [clearForm]);

	const renderFormFields = useCallback(() => {
		return Object.entries(typed).map(([key, value]) => {
			const multiline = key === "description";
			const label = key[0].toUpperCase() + key.slice(1);
			const info = `Enter ${key}`;
			const errCondition = typed[key] && errors[key] ? true : false;

			return (
				<TextField
					className={
						multiline
							? clsx("form_field", "long")
							: clsx("form_field", "short")
					}
					variant="outlined"
					key={key}
					name={key}
					type="text"
					label={label}
					multiline={multiline}
					rows={8}
					required={true}
					value={values[key]}
					onBlur={handleBlur}
					onChange={customHandleChange}
					error={errCondition}
					helperText={errCondition ? errors[key] : info}
					fullWidth={true}
					disabled={!edit}

					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<TextFieldsOutlinedIcon />
							</InputAdornment>
						),
					}}
				/>
			);
		});
	}, [typed, errors, edit, values, handleBlur, customHandleChange]);

	const validCondition = changed && isValid;

	return (
		<Box component="div" classes={{ root: classes.upd_user_form_wrapper }}>
			<Box component="div" className="main_fields_header">
				<Box component="div" className="title">
					<ListAltOutlinedIcon />
					<Typography variant="body1">Main Fields</Typography>
				</Box>
				<Box component="div" className="actions">
					{!edit && (
						<Tooltip title="Edit main fileds">
							<IconButton
								className="btn_edit"
								aria-label="Edit main fileds"
								component="span"
								onClick={() => setEdit(true)}
							>
								<EditOutlinedIcon />
							</IconButton>
						</Tooltip>
					)}
					{edit && (
						<Tooltip title="Cancel edit">
							<IconButton
								className="btn_cancel"
								aria-label="Cancel edit"
								component="span"
								onClick={handleCancelEdit}
							>
								<ClearOutlinedIcon />
							</IconButton>
						</Tooltip>
					)}
					{edit && (
						<Tooltip title="Submit changes">
							<IconButton
								className="btn_submit"
								aria-label="Submit changes"
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

			<form className="upd_user_form" noValidate autoComplete="off">
				{renderFormFields()}
			</form>
		</Box>
	);
};

UpdUserForm.propTypes = {
	current: PropTypes.array.isRequired,
	updUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	current: state.users.current,
});

export default connect(mapStateToProps, { updUser })(UpdUserForm);
