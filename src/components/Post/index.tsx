import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase-config";
import { AppContext } from "../../contexts/app.context";
import { deleteObject, ref } from "firebase/storage";
import Moment from "react-moment";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
  HeartIcon as Heartless,
  ShareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";

interface Props {
  post: DocumentSnapshot | QueryDocumentSnapshot;
  id: string;
}

export default function Post({ post, id }: Props) {
  const [likes, setLikes] = useState<QueryDocumentSnapshot[]>([]);
  const [comments, setComments] = useState<QueryDocumentSnapshot[]>([]);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  // const [open, setOpen] = useRecoilState(modalState);
  // const [postId, setPostId] = useRecoilState(postIdState);
  // const [currentUser] = useRecoilState(userState);
  const { open, setOpen, setPostId, profile } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),

      (snapshot) => {
        setLikes(snapshot.docs);
        console.log("likedddddddđ");
      }
    );
    // return unsubscribe
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => setComments(snapshot.docs)
    );
    // return unsubscribe
  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === profile?.uid) !== -1);
  }, [likes, profile]);

  async function likePost() {
    if (profile) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", profile?.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", profile?.uid), {
          username: profile?.username,
        });
      }
    } else {
      // signIn();
      navigate("/login");
    }
  }

  // console.log(profile, "this is after")
  // console.log(post.data()?.img, post?.data()?.text, 'this is id of the postttt')

  async function deletePost() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteDoc(doc(db, "posts", id));
      if (post.data()?.image) {
        deleteObject(ref(storage, `posts/${id}/image`));
      }
      navigate("/");
    }
  }
  // console.log(post?.data()?.timestamp.toDate(), 7777)

  const imgArray = post?.data()?.images as [];

  return (
    <div className="flex p-3  border-b border-gray-200">
      <img
        className="h-11 w-11 rounded-full mr-4 cursor-pointer object-cover"
        src={
          post?.data()?.id === profile?.uid
            ? profile?.userImg
            : post?.data()?.userImg
        }
        alt="user-img"
        onClick={() => {
          navigate(`/profile/${post?.data()?.id}`);
        }}
      />
      <div className="flex-1 cursor-pointer">
        <div className="flex items-center justify-between ">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline cursor-pointer">
              {post?.data()?.id === profile?.uid
                ? profile?.name
                : post?.data()?.name}
            </h4>

            <svg
              viewBox="0 0 22 22"
              aria-label="Verified account"
              role="img"
              className="h-5 w-5 fill-cyan-500"
              data-testid="icon-verified"
            >
              <g>
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
              </g>
            </svg>

            <span className="text-sm sm:text-[15px]">
              {post?.data()?.id === profile?.uid
                ? profile?.username
                : post?.data()?.username}
            </span>
            <span>.</span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>

          <EllipsisHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 " />
        </div>

        <p
          onClick={() => navigate(`/posts/${id}`)}
          className="text-gray-800 text-[15px sm:text-[16px] mb-2 "
        >
          {post?.data()?.text}
        </p>



        {post?.data()?.imgs && post.data()?.imgs.length > 0 && (
          <div className="flex flex-wrap">
            {post.data()?.imgs.map((img: string, index: number) => (
              <img
                key={index}
                onClick={() => navigate(`/posts/${id}`)}
                className="rounded-2xl mr-2 w-32 h-32 object-cover"
                src={img}
                alt={`Post image ${index}`}
              />
            ))}


    





        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatBubbleOvalLeftEllipsisIcon
              onClick={() => {
                if (!profile) {
                  // signIn();
                  navigate("/login");
                } else {
                  setPostId(id);
                  setOpen(!open);
                  console.log("you clicked the chat button");
                }
              }}
              className="h-9 w-9 rounded-full p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {comments.length > 0 && (
              <span className="text-sm">{comments.length}</span>
            )}
          </div>
          {profile?.uid === post?.data()?.id && (
            <TrashIcon
              onClick={deletePost}
              className="h-9 w-9 rounded-full p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIcon
                onClick={likePost}
                className="h-9 w-9 rounded-full p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <Heartless
                onClick={likePost}
                className="h-9 w-9 rounded-full p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes.length > 0 && (
              <span
                className={`${hasLiked && "text-red-600"} text-sm select-none`}
              >
                {likes.length}
              </span>
            )}
          </div>

          <ShareIcon className="h-9 w-9 rounded-full p-2 hover:text-sky-500 hover:bg-sky-100" />
          <ChartBarIcon className="h-9 w-9 rounded-full p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
      </div>
   );
}

//the effect trigger the onSnapshot function to listening to changes

// dung id cua post nay de listen user vi chi co nguoi dang post nay moi trung id vs post nay

// the img if not have, display nothing
