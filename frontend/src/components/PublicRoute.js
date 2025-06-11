// import { Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
//
// const PublicRoute = ({ children }) => {
//     const { isLoggedIn } = useAuth();
//     return !isLoggedIn ? children : <Navigate to="/mypage" replace />;
// };
//
// export default PublicRoute;
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return <div>로딩중...</div>;
    return !isLoggedIn ? children : <Navigate to="/mypage" replace />;
};

export default PublicRoute;
