import { Outlet, Navigate } from 'react-router-dom';
import {connect} from 'react-redux'

const PrivateRoute = ({ element: Component, allowedRoles, ...rest }) => { 
    if (rest.dataRedux.isLogin && rest.dataRedux.notes.role === "admin") {
        return <Outlet />; 
      } else {
        return <Navigate to="/login" />;
      }
  }
  

const reduxState = (state) => ({
    dataRedux : {
      notes: state.notes,
      isLogin: state.isLogin
    }
  })

export default connect(reduxState, null) (PrivateRoute)