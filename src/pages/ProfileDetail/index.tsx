import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { AppContext, UserData } from "../../contexts/app.context";
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { AnimatePresence, motion } from "framer-motion";
import Post from "../../components/Post";
interface RouteParams {
  id: string;
}
const ProfileDetail = () => {
  const { profile, setIsAuthenticated, setProfile } = useContext(AppContext);
  const [name, setName] = useState<string | undefined>("");
  const [userName, setUserName] = useState<string | undefined>("");

  const [posts, setPosts] = useState<QueryDocumentSnapshot[]>([]);

  const [followers, setFollowers] = useState<QueryDocumentSnapshot[]>([]);
  const [hasFollowed, setHasFolowed] = useState<boolean>(false);

  const [coverImage, setCoverImage] = useState<null | string>(null);
  const [avatarImage, setAvatarImage] = useState<null | string>(null);

  const [selectedFile, setSelectedFile] = useState<null | string>(null);
  const [user, setUser] = useState<UserData>();


  const [showEdit, setShowEdit] = useState(false);
  const [showUnfollow, setShowUnfollow] = useState(false);


  const [totalFollowers, setTotalFollowers] = useState<number>()
  const { id } = useParams();
  const location = useLocation();

  const coverImagePickerRef = useRef<HTMLInputElement>(null);
  const avatarImagePickerRef = useRef<HTMLInputElement>(null);

  const getLinkClass = () => {
    return `relative p-4 px-7 hover:after:absolute hover:after:content-[''] hover:font-bold hover:after:h-0.5 hover:after:w-full hover:after:bg-cyan-500 hover:after:bottom-0 hover:after:left-0`;
  };

  const navigate = useNavigate();
  console.log(location.pathname, "this is localtion");

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target && readerEvent.target.result) {
        setImage(readerEvent.target.result as string);
      }
    };
  };

  useEffect(() => {
    onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
    onSnapshot(collection(db, "users", id as string  , "followers"),
      (snapshot) => {
        setFollowers(snapshot.docs);
        console.log("likedddddddđ");
      }
    );

  }, []);
  const postOfUser = posts.filter((post) => post.data().id === id);

  async function followUser(followerId: string, followingId: string) {
    if (user) {
      await setDoc(doc(db, "users", followerId, "following", id as string), {
        name: user.name,
        username: user.username,
        userImg: user.userImg,
        userId: user.uid,
      });
    }
    if (profile) {
      await setDoc(doc(db, "users", followingId, "followers", profile.uid), {
        name: profile.name,
        username: profile.username,
        userImg: profile.userImg,
        userId: profile.uid,
      })
    }
  }

  async function unFollowUser(followerId: string, followingId: string) {
    if (user) {
      await deleteDoc(doc(db, "users", followerId, "following", id as string));
    }
    if (profile) {
      await deleteDoc(doc(db, "users", followingId, "followers", profile.uid))
    }
    setShowUnfollow(false)
  }


  // Usage Example
  useEffect(() => {
    setHasFolowed(followers.findIndex((follower) => follower.id === profile?.uid) !== -1);
    setTotalFollowers(followers.length)
  }, [followers, profile]);

  useEffect(() => {
    if (id === profile?.uid) {
      onSnapshot(doc(db, "users", id as string), (snapshot) => {
        setProfile(snapshot.data() as UserData);
        // console.log(snapshot.data(), "this is user 22222222222222222222222222");
        setUser(snapshot.data() as UserData);

        setName((snapshot.data() as UserData).name);
        setUserName((snapshot.data() as UserData).username);
      });
    } else if (id !== profile?.uid) {
      onSnapshot(doc(db, "users", id as string), (snapshot) => {
        // console.log(snapshot.data(), "this is user 22222222222222222222222222");
        setUser(snapshot.data() as UserData);
        setName((snapshot.data() as UserData).name);
        setUserName((snapshot.data() as UserData).username);
      });
    }
  }, [id, db]);

  const updateInfo = async () => {
    console.log("what is");

    const docRef = await updateDoc(doc(db, "users", id as string), {
      userImg: avatarImage ?? user?.userImg,
      backGroundImg: coverImage ?? user?.backGroundImg,
      name: name,
      username: userName,
    });
    console.log("does the update Work????????????");
    // setName(profile?.name);
    // setUserName(profile?.username)
    setCoverImage(null);
    setAvatarImage(null);
    setShowEdit(false);
  };

  // console.log(profile, 'this is the UPDATED user nameeeeeeeeeeeeee ')

  // console.log(user, "this is the UPDATED user data ");
  console.log(followers, 'here it issssssssssssss')
  // console.log(posts[0]?.id, 'POST 0000000000000')
  // console.log(posts[1]?.id, 'POST 1111111111111')
  // console.log(posts[2]?.id, 'POST 2222222222222')

  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[596px] sm:ml-[73px] flex-grow max-w-xl ">
      <div className="flex items-center space-x-2  py-2 px-3 sticky top-0  bg-white border-b border-gray-200">
        <div className="hoverEffect" onClick={() => navigate("/")}>
          <ArrowLeftIcon className="h-5 " />
        </div>
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Tweet</h2>
      </div>
      <div className="h-48 bg-slate-200 ">
        <img
          src={
            user?.backGroundImg ??
            "https://t4.ftcdn.net/jpg/03/78/40/11/360_F_378401105_9LAka9cRxk5Ey2wwanxrLTFCN1U51DL0.jpg"
          }
          className="h-full object-cover w-full border-none"
        />
      </div>
      <div className="px-4 pt-3 bg-white">
        <div className="flex h-20">
          <div className="relative -top-20">
            <img
              src={user?.userImg}
              className="h-36 w-36 object-cover rounded-full p-1 bg-white"
            />
          </div>

          {profile?.uid === id ? (
            <button
              className="p-4 bg-white rounded-3xl w-28 h-9 py-1 ml-auto hover:bg-slate-200 border-[1px] font-bold border-stone-300 tracking-normal"
              onClick={() => setShowEdit(true)}
            >
              Edit profile
            </button>
          ) : hasFollowed ? (
            <>
              <button
                className="p-4 bg-white rounded-3xl w-28 h-9 py-1 ml-auto border-[1px] font-bold hover:bg-red-100 hover:text-red-500 border-stone-300 tracking-normal hover:border-red-400"
                onClick={() => setShowUnfollow(true)}
              >
                Following
              </button>
            </>
          ) : (
            <>
              <button
                className="p-4 bg-white rounded-3xl w-28 h-9 py-1 ml-auto border-[1px] font-bold hover:bg-slate-100 border-stone-300 tracking-normal"
                onClick={() => followUser(profile?.uid as string, id as string)}
              >
                Follow
              </button>
            </>
          )}
        </div>
        <div className="flex">
          <div className="inline text-xl font-extrabold tracking-wide">
            {user?.name}
          </div>
          <svg
            viewBox="0 0 22 22"
            aria-label="Verified account"
            role="img"
            className="h-5 w-5 fill-cyan-500 mt-1"
            data-testid="icon-verified"
          >
            <g>
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
            </g>
          </svg>
        </div>
        <div className="text-slate-500">{user?.username}</div>
        <div className="mt-4 text-slate-500 items-start justify-start align-middle">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 inline-block mr-2 -mt-1"
          >
            <g>
              <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
            </g>
          </svg>
          Joined May 2024
        </div>
        <div className="flex mt-4 gap-4">
          <div>
            <Link            to={`/profile/${id}/following`}
>
              <span className="mr-[2px] font-bold text-14px">1304 </span>
              <span className="text-slate-500">Following </span>
            </Link>
          </div>
          <div>
            <Link            to={`/profile/${id}/followers`}
>
              <span className="mr-[2px] font-bold text-14px">{totalFollowers}</span>
              <span className="text-slate-500 ml-1">Followers </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex mt-4 bg- bg-slate-100 border-b-[1px]">
        <Link
          to={`/profile/${id}`}
          className={`${
            location.pathname === `/profile/${id}`
              ? "text-black font-bold relative p-4 px-7 after:absolute after:content-[''] after:h-0.5 after:w-full  after:bg-cyan-500 after:bottom-0 after:left-0"
              : "text-gray-500 relative p-4 px-7"
          }`}
        >
          Posts
        </Link>

        <Link to={`/profile/${id}`} className={getLinkClass()}>
          Replies
        </Link>

        <Link to={`/profile/${id}`} className={getLinkClass()}>
          Highlights
        </Link>

        <Link to={`/profile/${id}`} className={getLinkClass()}>
          Articles
        </Link>

        <Link to={`/profile/${id}`} className={getLinkClass()}>
          Media
        </Link>
        <Link to={`/profile/${id}`} className={getLinkClass()}>
          Likes
        </Link>
      </div>

      <AnimatePresence>
        {postOfUser.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Post key={post.id} id={post.id} post={post} />
          </motion.div>
        ))}
      </AnimatePresence>

      {showEdit && (
        <Modal
          isOpen={showEdit}
          onRequestClose={() => setShowEdit(false)}
          className="max-w-lg w-[90%] absolute top-14 left-[50%]  translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md lg:min-w-[700px] lg:max-h-[600px] "
          overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50"

        >
          <div className="p-1">
            <div className="border-b border-gray-200 py-2 px-1.5 flex">
              <div
                onClick={() => setShowEdit(false)}
                className="hoverEffect w-10 h-10 flex items-center justify-center hover:bg-slate-300"
              >
                <XMarkIcon className="h-[23px] text-gray-700 p-0" />
              </div>

              <button
                className="bg-black text-white px-6 py-1.5 rounded-full font-bold shadow-md hover:brightness-95  ml-auto"
                onClick={updateInfo}
              >
                Save
              </button>
            </div>
            {user && (
              <>
                <div className="flex p-3 ">
                  <div className="h-12 mr-3">
                    <div
                      className=""
                      onClick={() => coverImagePickerRef.current?.click()}
                    >
                      <div className="text-xs w-14">Cover Img</div>
                      <ArrowUpTrayIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        ref={coverImagePickerRef}
                        onChange={(e) => handleImageUpload(e, setCoverImage)}
                      />
                    </div>
                  </div>
                  <div className="w-full ">
                    <div className="">
                      <img
                        src={coverImage ?? user.backGroundImg}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex p-3">
                  <div className="h-12 mr-3">
                    <div
                      className=""
                      onClick={() => avatarImagePickerRef.current?.click()}
                    >
                      <div className="text-xs w-14">Avatar</div>
                      <ArrowUpTrayIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        ref={avatarImagePickerRef}
                        onChange={(e) => handleImageUpload(e, setAvatarImage)}
                      />
                    </div>
                  </div>
                  <div className="">
                    <img
                      src={avatarImage ?? user.userImg}
                      className="h-40 w-40 object-cover rounded-full"
                    />
                  </div>
                </div>

                <div className="flex p-3">
                  <div className="h-12 mr-3">
                    <div className="text-xs w-14">Name</div>
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-red-100 w-full h-8 pl-2"
                    />
                  </div>
                </div>

                <div className="flex p-3">
                  <div className="h-12 mr-3">
                    <div className="text-xs w-14">Username</div>
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-red-100 w-full h-8 pl-2"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}















{showUnfollow && (
        <Modal
          isOpen={showUnfollow}
          onRequestClose={() => setShowUnfollow(false)}
          overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50"

          className="max-w-lg  absolute top-44 left-[50%]  translate-x-[-50%] bg-white border-2 border-gray-200 rounded-3xl shadow-md lg:max-w-[330px] lg:max-h-[400px] p-6 "
        >
          <div className="flex flex-col justify-center items-start ">
          <div className="text-xl font-extrabold pl-2">Unfollow {user?.username} ?</div>
          <div className="mt-2 text-base  text-slate-500 pl-2 leading-6">Their posts will no longer show up in your For You timeline. You can still view their profile, unless their posts are protected. </div>
          <button className="p-3 bg-black text-white w-full mt-5 rounded-3xl font-extrabold tracking-wide hover:bg-slate-800" onClick={() => unFollowUser(profile?.uid as string, id as string)}
>Unfollow</button>
          <button className="p-3 bg-white text-black w-full mt-3 rounded-3xl border-slate-300 border-[1px] font-extrabold tracking-wide hover:bg-slate-200" onClick={ () =>setShowUnfollow(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProfileDetail;

// fill data into Modal

// neu dung la nguoi dang dang nhap vao Profile nay thi se set Global state de cho neu thay doi thong tin j thi sideBar cx dc cap nhat
// neu ko thi snapshot de listen realtime data nho ng chu Profile nay vua them post gi thi minh con biet
// user chinh la local Profile
