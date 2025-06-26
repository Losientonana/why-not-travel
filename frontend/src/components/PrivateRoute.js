// // import { Navigate } from "react-router-dom";
// // import { useAuth } from "../contexts/AuthContext";
// //
// // const PrivateRoute = ({ children }) => {
// //     const { isLoggedIn } = useAuth();
// //     return isLoggedIn ? children : <Navigate to="/login" replace />;
// // };
// //
// // export default PrivateRoute;
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
//
// const PrivateRoute = ({ children }) => {
//     const { isLoggedIn } = useAuth();
//     return isLoggedIn ? children : <Navigate to="/login" replace />;
// };
//
// export default PrivateRoute;
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return <div>로딩중...</div>;
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
