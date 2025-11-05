import { Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "./component/common/Footer/Footer";
import Header from "./component/common/Header/Header";
import BoardList from "./component/Board/BoardList";
import Home from "./component/common/Home/Home";
import Join from "./component/Member/Join/Join";
import Login from "./component/Member/Login/Login";
import { AuthProvider } from "./component/context/AuthContext";
import Info from "./component/Member/Info/Info";
import BoardForm from "./component/Board/BoardForm";
import BoardDetail from "./component/Board/BoardDetail";

function App() {
  return (
    <>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/info" element={<Info />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/form" element={<BoardForm />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
          <Route path=  "/*" element={<div>돌아가시오.</div>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </>
  );
}
export default App;
