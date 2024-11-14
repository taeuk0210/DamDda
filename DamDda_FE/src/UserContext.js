import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie"; // js-cookie를 사용하여 쿠키 관리
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // 쿠키에서 사용자 정보를 가져옵니다.

    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : { key: 0 }; // 쿠키에서 JSON 문자열을 가져와 파싱
  });

  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // user 상태가 변경될 때마다 쿠키에 저장합니다.
    if (user && user.key !== 0) {
      Cookies.set("user", JSON.stringify(user)); //, { expires: 7 }); // 7일 동안 유효한 쿠키
    } else {
      Cookies.remove("user"); // 유저 정보가 없을 때 쿠키 삭제
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    setIsLogin(true);
  };

  const logout = () => {
    setUser({ key: 0 });
    Cookies.remove("user"); // 쿠키에서 사용자 정보 삭제
    Cookies.remove("accessToken"); // 액세스 토큰 삭제
    setIsLogin(false);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLogin, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
