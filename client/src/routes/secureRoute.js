import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
// redux
import { connect } from 'react-redux';

const SecureRoute = ({
  users,
  component: Component,
  ...rest
}) => {  

  const { current } = users;   

  return (
    <Route
      {...rest}
      render={(props) =>        
        current.length > 0 ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

SecureRoute.propTypes = {
  users: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    users: state.users   
  }
};

export default connect(mapStateToProps, null)(SecureRoute);
