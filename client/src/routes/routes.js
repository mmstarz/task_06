import React from "react";
// react-router-dom
import { Switch, Route } from "react-router-dom";
// components
import Dashboard from "pages/dashboard";
import AddUser from "pages/addUser";
import EditUser from "pages/editUser";
// restrictions
import SecureRoute from "routes/secureRoute";

const Routes = () => {
	return (
		<Switch>
			<SecureRoute exact path="/updUser/:id" component={EditUser} />
			<Route exact path="/addUser" component={AddUser} />
			<Route exact path="/" component={Dashboard} />
		</Switch>
	);
};

export default Routes;
