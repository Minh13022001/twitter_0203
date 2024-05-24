import {
  EllipsisHorizontalIcon,
} from "@heroicons/react/16/solid";
import SidebarMenuItem from "../../../components/SidebarMenuItem";
import { useContext, useEffect } from "react";
import { AppContext, UserData } from "../../../contexts/app.context";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../../firebase-config";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import { SignupInfo } from "../../../type/authTypes";
import { useNavigate } from "react-router-dom";
import { BookmarkIcon, ClipboardIcon, EllipsisHorizontalCircleIcon, HashtagIcon, InboxIcon, UserIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/20/solid";

export default function Sidebar() {
  const { profile, setProfile, isAuthenticated, setIsAuthenticated, openTweet, setOpenTweet } =
    useContext(AppContext);

    const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){

          const fetchUser = async () => {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {

              setProfile(docSnap.data() as UserData);
            }
          };
          fetchUser()
      } else {
        setProfile(null)
      }

    })
  }, [])

  function onSignOut() {
    signOut(auth)
    // setProfile(null);
  }
  return (
    <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24">
      <div className="hoverEffect p-0 hover:bg-blue-100 xl:px-1">
        <img
          width="50"
          height="50"
          src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
        ></img>
      </div>


      <div className="mt-4 mb-2.5 xl:items-start">
        <SidebarMenuItem text="Home" Icon={HomeIcon} active />
        <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
        {profile && (
          <>
            <SidebarMenuItem text="Notifications" Icon={BellIcon} />
            <SidebarMenuItem text="Messages" Icon={InboxIcon} />
            <SidebarMenuItem text="Bookmarks" Icon={BookmarkIcon} />
            <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
            <SidebarMenuItem text="Profile" Icon={UserIcon} />
            <SidebarMenuItem text="More" Icon={EllipsisHorizontalCircleIcon} />
          </>
        )}
      </div>


      {profile ? (
        <>
          <button className="bg-cyan-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
          onClick={()=>{   
            setOpenTweet(!openTweet);
           }}
          >
            Tweet
          </button>


          <div className="hover:bg-slate-200 text-gray-700 flex items-center justify-center xl:justify-start mt-auto w-full p-2 rounded-3xl cursor-pointer">
            <img
              onClick={onSignOut}
              src={profile?.userImg ?? "https://t4.ftcdn.net/jpg/03/78/40/11/360_F_378401105_9LAka9cRxk5Ey2wwanxrLTFCN1U51DL0.jpg"}
              alt="user-img"
              className="h-10 w-10 rounded-full xl:mr-2 object-cover"
            />
            <div className="leading-5 hidden xl:inline">
              <h4 className="font-bold">{profile?.name}</h4>
              <p className="text-gray-500">{profile?.username}</p>
            </div>
            <EllipsisHorizontalIcon className="h-5 xl:ml-auto hidden xl:inline" />
          </div>
        </>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-sky-400 text-white rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
        >
          Sign in
        </button>
      )}
    </div>
  );
}


// khi signin/out thi trigger callback
//callback : de thay the cho LS

// set isAuthenticated
// set profile
// clear LS
// navigate

// For example, if a user is signed in, you can fetch additional user data from the Firestore database and update the application state accordingly.
// isAuthen, setprofile
// auth, (user) => {     user là cái k bị mất đi khi refresh , so it can replace LS