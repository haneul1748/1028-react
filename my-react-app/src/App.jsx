import { Routes, Route} from "react-router-dom";
import './App.css';
import Chapter01 from './components/Chapter01/Chapter01';
import Fusion from './components/modules/Fusion';
import SelectBoard from './components/Chapter01/SelectBoard';
import Header from './components/Common/Header/Header';
import Chapter02 from "./components/Chapter02/Chapter02";
import Chapter03 from "./components/Chapter03/Chapter03";
import Chapter03_Input from "./components/Chapter03/Chapter03_input";
import Foods from "./components/Busan/Foods";
import Detail from "./components/Busan/Detail/Detail";

function App() {
  return (
    <>
      {/* 자바스크립트 코드를 작성할 수 있는 영역 */}
      {false && <Fusion /> && <Chapter01 /> && <SelectBoard />}
      <Header />

      <Routes>
        <Route path="/main" element={<main />} />
        <Route path="/fusion" element={<Fusion />}/>
        <Route path="/01" element={<Chapter01 />} />
        <Route path="/02" element={<Chapter02 />} />
        <Route path="/03" element={<Chapter03 />} />
        <Route path="/input" element={<Chapter03_Input />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/foods/:id" element={<Detail />} />
        <Route path="/*" element={<h1>존재하지 않는 페이지입니다.</h1>} />
      </Routes>
    </>
  );
}

export default App;