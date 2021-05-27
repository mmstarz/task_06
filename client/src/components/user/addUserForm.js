import { useState, useCallback } from "react";
import PropTypes from "prop-types";
// redux
import { connect } from "react-redux";
import { addUser } from "store/actions/usersActions";
// formik & yup
import { useFormik } from "formik";
import * as yup from "yup";
// mui compponents
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
// mui icons
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import TextFieldsOutlinedIcon from "@material-ui/icons/TextFieldsOutlined";
import PlaylistAddCheckOutlinedIcon from "@material-ui/icons/PlaylistAddCheckOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
// mui styles
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	add_user_form_wrapper: {
		width: "100%",
		padding: theme.spacing(1),
		"& .form_title": {
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
		"& .add_user_form": {
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

const AddUserForm = ({ addUser }) => {
	const classes = useStyles();

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
			name: "",
			surname: "",
			description: "",
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
				addUser(variables);
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
	}, [typed, errors, values, handleBlur, customHandleChange]);

	const validCondition = changed && isValid;

	return (
		<Box component="div" classes={{ root: classes.add_user_form_wrapper }}>
			<Box component="div" className="form_title">
				<ListAltOutlinedIcon />
				<Typography variant="body1">Fill the form</Typography>
			</Box>
			<form
				className="add_user_form"
				onSubmit={handleSubmit}
				noValidate
				autoComplete="off"
			>
				{renderFormFields()}
				<Box component="div" className="form_actions">
					<Button
						type="submit"
						variant="contained"
						className="submit"
						endIcon={<PlaylistAddCheckOutlinedIcon />}
						disabled={!validCondition}
					>
						Submit
					</Button>
					<Button
						variant="contained"
						className="cancel"
						startIcon={<ClearOutlinedIcon />}
						disabled={!changed}
						onClick={clearForm}
					>
						Cancel
					</Button>
				</Box>
			</form>
		</Box>
	);
};

AddUserForm.propTypes = {
	addUser: PropTypes.func.isRequired,
};

export default connect(null, { addUser })(AddUserForm);
