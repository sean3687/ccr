import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Chat from "../pages/Chat.tsx";
import Login from "../pages/Login.tsx";

export default function RouterComponent() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    )
}
