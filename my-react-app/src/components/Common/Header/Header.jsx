import './Header.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navi = useNavigate(); 

    return (
        <>
        <header className="navbar">
            <div id="navbar">
                <div className="navbar__logo">
                    <i className="fas fa-dog"></i>
                    <a href="/main">HOME</a>
                </div>

                <ul className="navbar_menu">
                    <li><a onClick={() => navi("/fusion")}>유즈네비 퓨전</a></li>
                    <li><a onClick={() => navi("/01")}>유즈네비 01</a></li>
                    <li><a href="/fusion">퓨전</a></li>
                    <li><a href="/01">01</a></li>
                    <li><a href="/02">02</a></li>
                    <li><a href="/03">03</a></li>
                    <li><a href="/input">input</a></li>
                    <li><a href="/foods">부산</a></li>
                </ul>
            </div>
            </header>
        </>
    );
}

export default Header;