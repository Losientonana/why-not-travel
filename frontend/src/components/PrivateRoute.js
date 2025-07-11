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
    const { user, isLoggedIn, loading } = useAuth();

    if (loading) {
        return <div>로딩중...</div>; // AuthContext 로딩 중
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 로그인은 되었지만, 닉네임이 없는 경우
    if (user && (!user.nickname || user.nickname.trim() === "")) {
        return <Navigate to="/nickname" replace />;
    }

    return children;
};

export default PrivateRoute;
