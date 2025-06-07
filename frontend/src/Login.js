import React from "react";
import axios from "axios";

const onNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
};

function Login(props) {
    // 테스트용 GET 요청
    const onTestApi = () => {
        axios
            .get("http://localhost:8080/", { withCredentials: true })
            .then((res) => {
                alert(JSON.stringify(res.data));
            })
            .catch((error) => alert(error));
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={onNaverLogin}>naver login</button>
            <button onClick={onTestApi}>백엔드 "/" 테스트</button>
        </div>
    );
}

export default Login;
