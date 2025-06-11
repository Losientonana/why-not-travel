// // import React from "react";
// // import { BrowserRouter } from "react-router-dom";
// // import { AuthProvider } from "./contexts/AuthContext";
// // import Navbar from "./components/Navbar";
// // import MyRoutes from "./routes/MyRoutes";
// //
// // function App() {
// //     return (
// //         <AuthProvider>
// //             <BrowserRouter>
// //                 <Navbar />
// //                 <MyRoutes />
// //             </BrowserRouter>
// //         </AuthProvider>
// //     );
// // }
// //
// // export default App;
//
// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
// import Navbar from "./components/Navbar";
// import MyRoutes from "./routes/MyRoutes";
// import NicknameGuard from "./components/NicknameGuard";
//
// function App() {
//     return (
//         <AuthProvider>
//             <BrowserRouter>
//                 <Navbar />
//                 <div
//                     style={{
//                         maxWidth: 400,
//                         margin: "40px auto",
//                         background: "#fff",
//                         borderRadius: 14,
//                         boxShadow: "0 2px 18px rgba(30,40,50,.08)",
//                         padding: 32,
//                         minHeight: 320,
//                         fontFamily: "Pretendard, sans-serif"
//                     }}
//                 >
//                     <NicknameGuard>
//                     <MyRoutes />
//                     </NicknameGuard>
//                 </div>
//             </BrowserRouter>
//         </AuthProvider>
//     );
// }
//
// export default App;
//
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import MyRoutes from "./routes/MyRoutes";
import NicknameGuard from "./components/NicknameGuard";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <div
                    style={{
                        maxWidth: 400,
                        margin: "40px auto",
                        background: "#fff",
                        borderRadius: 14,
                        boxShadow: "0 2px 18px rgba(30,40,50,.08)",
                        padding: 32,
                        minHeight: 320,
                        fontFamily: "Pretendard, sans-serif"
                    }}
                >
                    <NicknameGuard>
                        <MyRoutes />
                    </NicknameGuard>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
