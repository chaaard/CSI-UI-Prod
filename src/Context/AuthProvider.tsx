import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";
import IAuthUser from "./_Interfaces/IAuthUser";

enum HANDLERS {
  INITIALIZE = "INITIALIZE",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
  SET_TOKEN = "SET_TOKEN",
}

type Action = {
  type: string;
  [key: string]: any;
};

type State = {
  [key: string]: any; // You can replace 'any' with the actual type of your state
};

type HandlerFunction = (state: State, action: Action) => State;

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    fullName: "",
  },
  token: "",
};

const handlers: { [key: string]: HandlerFunction } = {
  [HANDLERS.INITIALIZE]: (state: any, action: any) => {
    const user = action.payload;
    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user: {
              ...state.user,
              fullName: `${user.FirstName} ${user.LastName}`,
            },
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state: any, action: any) => {
    const user = action.payload;
    localStorage.setItem("fullName", `${user.FirstName} ${user.LastName}`);
    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SET_TOKEN]: (state: any, action: any) => {
    const token = action.payload;
    return {
      ...state,
      token,
    };
  },

  [HANDLERS.SIGN_OUT]: (state: any) => {
    return {
      ...state,
      isAuthenticated: false,
      user: {
        ...state.user,
        fullName: "",
      },
    };
  },
};

const reducer = (state: any, action: any) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface IAuthProvider {
  Auth?: string;
  Persist: boolean;
}

export interface IAuthContext {
  data: IAuthProvider;
  testFunction: (newData: IAuthProvider) => void;
  signIn: (result: IAuthUser) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<IAuthContext>({
  data: {
    Persist: false,
  },
  testFunction: (newData: IAuthProvider) => {
    console.log(newData);
  },
  signIn: (result: IAuthUser) => Promise.resolve(),
  signOut: () => {},
  isAuthenticated: false,
  token: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);

  const setToken = (token: string) => {
    try {
      Cookies.set("token", token, { expires: 7 });
      initialize(token);
    } catch (err) {
      console.error(err);
    }
  };

  const initialize = (token?: string) => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    try {
      const storedToken = token || Cookies.get("token");
      const isAuthenticated = !!storedToken;
      if (isAuthenticated) {
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: storedToken,
        });
        startSessionTimeout();
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    initialize();
    setLoading(false);
  }, []);

  const signIn = async (result: IAuthUser) => {
    try {
      window.localStorage.setItem(
        "fullName",
        `${result.FirstName} ${result.LastName}`
      );
      window.localStorage.setItem("Id", `${result.Id}`);
      window.localStorage.setItem("userName", `${result.Username}`);
      window.localStorage.setItem("roleId", `${result.RoleId}`);
      window.localStorage.setItem("club", `${result.Club}`);
      setToken(result.Token);
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = async () => {
    try {
      window.localStorage.clear();
      Cookies.remove("token");
      dispatch({
        type: HANDLERS.SIGN_OUT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const isAuthenticated = state.isAuthenticated;
  const token = state.token;

  const [data, setData] = useState<IAuthProvider>({
    Auth: "",
    Persist: false,
  });

  const testFunction = (newData: IAuthProvider) => {
    setData(newData);
  };

  const startSessionTimeout = () => {
    const sessionTimeout = 57600000;
    setTimeout(() => {
      signOut();
    }, sessionTimeout);
  };

  return (
    <AuthContext.Provider value={{ signIn, data, testFunction, isAuthenticated, token, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
