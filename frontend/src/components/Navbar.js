// import { useAuth } from "../contexts/AuthContext";
// import { Link } from "react-router-dom";
//
// const Navbar = () => {
//     const { isLoggedIn } = useAuth();
//     return (
//         <nav
//             style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 background: "#f8fafc",
//                 padding: "0 32px",
//                 height: 56,
//                 borderBottom: "1px solid #e5e7eb",
//                 fontFamily: "Pretendard, sans-serif",
//             }}
//         >
//             <span style={{ fontWeight: 700, fontSize: 22, color: "#3b82f6" }}>
//                 Oauth2+JWT 예제
//             </span>
//             {isLoggedIn && (
//                 <div style={{ display: "flex", gap: "24px" }}>
//                     <Link to="/mypage" style={navLinkStyle}>MyPage</Link>
//                     <Link to="/logout" style={navLinkStyle}>Logout</Link>
//                 </div>
//             )}
//         </nav>
//     );
// };
//
// const navLinkStyle = {
//     textDecoration: "none",
//     color: "#334155",
//     fontWeight: 500,
//     fontSize: 18,
//     padding: "6px 16px",
//     borderRadius: 8,
//     transition: "background 0.2s",
//     background: "#f1f5f9"
// };
//
// export default Navbar;
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { isLoggedIn } = useAuth();
    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
                padding: "0 32px",
                height: 56,
                borderBottom: "1px solid #e5e7eb",
                fontFamily: "Pretendard, sans-serif",
            }}
        >
            <span style={{ fontWeight: 700, fontSize: 22, color: "#3b82f6" }}>
                Oauth2+JWT 예제
            </span>
            {isLoggedIn && (
                <div style={{ display: "flex", gap: "24px" }}>
                    <Link to="/mypage" style={navLinkStyle}>MyPage</Link>
                    <Link to="/logout" style={navLinkStyle}>Logout</Link>
                </div>
            )}
        </nav>
    );
};

const navLinkStyle = {
    textDecoration: "none",
    color: "#334155",
    fontWeight: 500,
    fontSize: 18,
    padding: "6px 16px",
    borderRadius: 8,
    transition: "background 0.2s",
    background: "#f1f5f9"
};

export default Navbar;
