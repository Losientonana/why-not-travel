import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import JoinPage from "../pages/JoinPage";
import MyPage from "../pages/MyPage";
import OAuth2Redirect from "../pages/OAuth2Redirect";
import Logout from "../pages/Logout";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";

const MyRoutes = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        } />
        <Route path="/join" element={
            <PublicRoute>
                <JoinPage />
            </PublicRoute>
        } />
        <Route path="/mypage" element={
            <PrivateRoute>
                <MyPage />
            </PrivateRoute>
        } />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/logout" element={<Logout />} />
    </Routes>
);

export default MyRoutes;
