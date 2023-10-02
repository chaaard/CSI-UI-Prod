import { useContext } from "react";
import AuthContext, { IAuthContext } from "../Context/AuthProvider";

const useAuth = (): IAuthContext => {
  const authContext = useContext(AuthContext);
  return authContext;
};

export default useAuth;
