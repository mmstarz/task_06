import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// redux
import { Provider as ReduxProvider } from "react-redux";
import store from "store/store";
// router
import { BrowserRouter as Router } from "react-router-dom";
// components
import Routes from "routes/routes";
// material-ui theme
import {
	unstable_createMuiStrictModeTheme,
	ThemeProvider,
} from "@material-ui/core/styles";
const theme = unstable_createMuiStrictModeTheme();

const App = () => {
	return (
		<ReduxProvider store={store}>
			<Router>
				<Routes />
			</Router>
		</ReduxProvider>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
