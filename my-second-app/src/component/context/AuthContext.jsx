import { useState, useEffect, createContext, Children } from "react";

export const AuthContext = createContext();
// 요 컨텍스트를 통해 인증관련 데이터를 하위 컨포넌트에 전달함

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    member: null,
    memberName: null,
    accessToken: null,
    refreshToken: null,
    role: null,
    isAuthenticated: false,
  });

  // 자동로그인 구현을 위한 useEffect
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const memberId = localStorage.getItem("memberId");
    const memberName = localStorage.getItem("memberName");
    const role = localStorage.getItem("role");

    if (accessToken && refreshToken && memberId && memberName && role) {
      setAuth({
        memberId,
        memberName,
        accessToken,
        refreshToken,
        role,
        isAuthenticated: true,
      });
    }
  }, []);

  // 로그인에 성공했을때 수행할 함수
  const login = (memberId, memberName, accessToken, refreshToken, role) => {
    setAuth({
      memberId,
      memberName,
      accessToken,
      refreshToken,
      role,
      isAuthenticated: true,
    });

    localStorage.setItem("memberId", memberId);
    localStorage.setItem("memberName", memberName);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setAuth({
      member: null,
      memberName: null,
      accessToken: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("memberId");
    localStorage.removeItem("memberName");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return(
    <AuthContext.Provider value={{auth, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
};
