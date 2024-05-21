import { createContext, useState } from "react";
import { Result } from "../type/result";
import { getProfileFromLS } from "../utils/authen";

export interface UserData {
  email: string;
  name: string;
  timestamp: unknown;
  uid: string;
  userImg: string;
  backGroundImg: string;
  username: string;
}

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: UserData | null;
  setProfile: React.Dispatch<React.SetStateAction<UserData | null>>;
  users: Result[] | null;
  setUser: React.Dispatch<React.SetStateAction<Result[] | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openTweet: boolean;
  setOpenTweet: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getProfileFromLS()),
  setIsAuthenticated: () => null,
  profile: {
    email: "",
    name: "",
    timestamp: null,
    uid: "",
    userImg: "",
    username: "",
    backGroundImg: "",
  },
  setProfile: () => null,
  users: [],
  setUser: () => null,
  open: false,
  setOpen: () => null,
  openTweet: false,
  setOpenTweet: () => null,
  postId: "",
  setPostId: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  );
  const [profile, setProfile] = useState<UserData | null>(
    initialAppContext.profile
  );
  const [users, setUser] = useState<Result[] | null>(initialAppContext.users);
  const [open, setOpen] = useState<boolean>(initialAppContext.open);
  const [postId, setPostId] = useState<string>(initialAppContext.postId);
  const [openTweet, setOpenTweet] = useState<boolean>(initialAppContext.open);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        users,
        setUser,
        open,
        setOpen,
        postId,
        setPostId,
        openTweet,
        setOpenTweet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
