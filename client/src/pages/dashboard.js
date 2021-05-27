import { useEffect, useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
// router
import { Link } from "react-router-dom";
// redux
import { connect } from "react-redux";
import { getUsers, remUser } from "store/actions/usersActions";
import { setPagination } from "store/actions/paginationActions";
// components
import Header from "components/header/header";
import Loading from "components/loading/loading";
import Notification from "components/notification/notification";
import CustomDialog from "components/customDialog/customDialog";
// mui components
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
// mui icons
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
// mui styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	dashboard_root: {
		width: "100%",
		minHeight: "100vh",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		"& .no_users": {
			margin: theme.spacing(1),
			"& p": {
				textAlign: "center",
			},
		},
		"& .users_wrapper": {
			display: "flex",
			alignItems: "center",
			flexWrap: "wrap",
			justifyContent: "center",
			"@media (min-width: 500px)": {
				justifyContent: "flex-start",
			},
			"& .user_item": {
				position: "relative",
				width: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				margin: theme.spacing(1),
				background: "aliceblue",
				"& .user_action_box": {
					position: "absolute",
					top: 0,
					right: 0,
					padding: theme.spacing(0.5),
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
				},
				"& .user_avatar_box": {
					margin: theme.spacing(1),
					"& .avatar": {
						width: 180,
						height: 180,
					},
				},
				"& .user_info_box": {
					width: "100%",
					padding: theme.spacing(1),
					"& p": {
						minHeight: 56,
						textAlign: "center",
						margin: theme.spacing(1),
						padding: theme.spacing(1),
					},
				},
				"@media (min-width: 250px)": {
					width: "calc(100% - 16px)",
					maxWidth: 300,
				},
				"@media (min-width: 500px)": {
					width: "calc(50% - 16px)",
					maxWidth: "unset",
				},
				"@media (min-width: 750px)": {
					width: "calc(33.33% - 16px)",
				},
				"@media (min-width: 1000px)": {
					width: "calc(25% - 16px)",
				},
			},
		},
		"& .pagination_root": {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			margin: "auto 4px 4px 4px",
			padding: theme.spacing(1),
		},
	},
}));

const Dashboard = ({ getUsers, users, pagination, setPagination, remUser }) => {
	const classes = useStyles();

	const { loading, current, count } = users;
	const { page, skip, limit } = pagination;

	const [showDialog, setDialog] = useState(false);
	const [userToRemove, setUserToRemove] = useState("");

	const handleDialog = useCallback((id) => {
		setDialog(true);
		setUserToRemove(id);
	}, []);

	const pages = useMemo(() => {
		return Math.ceil(count / limit);
	}, [count, limit]);

	useEffect(() => {
		let mount = true;

		if (mount && loading) {
			// dispatch action
			getUsers({ skip, limit });
		}

		return () => {
			mount = false;
		};
	}, [loading, getUsers, skip, limit]);

	const handlePageChange = useCallback(
		async (event, newPage) => {
			try {
				const newSkip = (newPage - 1) * limit;
				// send redux action
				setPagination({ skip: newSkip, limit, page: newPage });

				// send redux action
				getUsers({ skip: newSkip, limit });
			} catch (err) {
				console.log(err.message);
			}
		},
		[limit, setPagination, getUsers]
	);

	const handleUserRemove = useCallback(() => {
		// more then one user on current page
		if (page > 0 && current.length > 1) {
			remUser(userToRemove);
		}

		// last user on current page
		if (page > 0 && current.length === 1) {
			remUser(userToRemove);
			handlePageChange(null, page - 1);
		}

		// first page
		remUser(userToRemove);
	}, [remUser, userToRemove, current, page, handlePageChange]);

	const renderUsers = useCallback(() => {
		return current.map(({ _id, name, surname, description, avatar }) => {
			return (
				<Paper elevation={1} className="user_item" key={_id}>
					<Box component="div" className="user_action_box">
						<Tooltip title="Edit user">
							<IconButton
								aria-label="Edit user"
								color="inherit"
								component={Link}
								to={`/updUser/${_id}`}
							>
								<EditOutlinedIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Remove user">
							<IconButton
								aria-label="Remove user"
								component="span"
								color="secondary"
								onClick={() => handleDialog(_id)}
							>
								<DeleteOutlineOutlinedIcon />
							</IconButton>
						</Tooltip>
					</Box>
					<Box component="div" className="user_avatar_box">
						<Avatar
							alt={`${name}-${surname}`}
							src={avatar.url}
							className="avatar"
						/>
					</Box>
					<Box component="div" className="user_info_box">
						<Typography variant="body2">
							{name} {surname}
						</Typography>
						<Typography variant="body2">{description}</Typography>
					</Box>
				</Paper>
			);
		});
	}, [current, handleDialog]);

	return (
		<Box component="div" classes={{ root: classes.dashboard_root }}>
			<Header title="Users" linkPath="/addUser" />
			{loading && <Loading />}
			<section className="main_section">
				{!loading && current.length === 0 && (
					<Notification msg="There are no users so far" />
				)}
				{!loading && current.length > 0 && (
					<Box component="div" className="users_wrapper">
						{renderUsers()}
					</Box>
				)}
			</section>
				<Pagination
					shape="rounded"
					variant="outlined"
					className="pagination_root"
					page={page}
					count={pages}
					onChange={handlePageChange}
					siblingCount={0}
					boundaryCount={1}
				/>
			
			<CustomDialog
				show={showDialog}
				handleCancel={() => setDialog(false)}
				handleSubmit={handleUserRemove}
				title="Remove user"
				msg="This is not retroactive. Are you sure of that?"
			/>
		</Box>
	);
};

Dashboard.propTypes = {
	users: PropTypes.object.isRequired,
	getUsers: PropTypes.func.isRequired,
	remUser: PropTypes.func.isRequired,
	setPagination: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	return {
		users: state.users,
		pagination: state.pagination.users,
	};
};

export default connect(mapStateToProps, { getUsers, setPagination, remUser })(
	Dashboard
);
