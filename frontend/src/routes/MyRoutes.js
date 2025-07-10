import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import JoinPage from "../pages/JoinPage";
import MyPage from "../pages/MyPage";
import OAuth2Redirect from "../pages/OAuth2Redirect";
import Logout from "../pages/Logout";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";
import NicknameForm from "../pages/NicknameForm";
import ViewTravelPlansPage from "../pages/ViewTravelPlansPage"; // 새로 추가
import CreateTravelPlanPage from "../pages/CreateTravelPlanPage"; // 새로 추가

const MyRoutes = () => {
    const navigate = useNavigate();

    const handleNicknameSuccess = () => {
        navigate("/"); // 닉네임 설정 성공 시 홈페이지로 이동
    };

    return (
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
            <Route path="/travel-plans/view" element={
                <PrivateRoute>
                    <ViewTravelPlansPage />
                </PrivateRoute>
            } />
            <Route path="/travel-plans/create" element={
                <PrivateRoute>
                    <CreateTravelPlanPage />
                </PrivateRoute>
            } />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/nickname" element={<NicknameForm onSuccess={handleNicknameSuccess} />} />
        </Routes>
    );
};

export default MyRoutes;
