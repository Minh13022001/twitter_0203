import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/app.context";
import { ChatBubbleOvalLeftEllipsisIcon, TrashIcon, HeartIcon as Heartless, ShareIcon, ChartBarIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { QueryDocumentSnapshot, collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { CommentType } from "../../type/comment";
import Moment from "react-moment";

interface Props {
  comment: CommentType 
  commentId : string
  originalPostId : string
}


export default function Comment({ comment, commentId, originalPostId } : Props) {
    const [likes, setLikes] = useState<QueryDocumentSnapshot[]>([]);
    const [hasLiked, setHasLiked] = useState(false);
    const navigate = useNavigate()

    const { open, setOpen, setPostId, profile, postId } =  useContext(AppContext)


    useEffect(() => {
      const unsubscribe = onSnapshot(
        collection(db, "posts", originalPostId, "comments", commentId, "likes"),
        (snapshot) => setLikes(snapshot.docs)
      );
    }, [db, originalPostId, commentId])
  
    useEffect(() => {
      setHasLiked(likes.findIndex((like) => like.id === profile?.uid) !== -1);
    }, [likes, profile]);
  
    async function likeComment() {
      if (profile) {
        if (hasLiked) {
          await deleteDoc(
            doc(
              db,
              "posts",
              originalPostId,
              "comments",
              commentId,
              "likes",
              profile?.uid
            )
          );
        } else {
          await setDoc(
            doc(
              db,
              "posts",
              originalPostId,
              "comments",
              commentId,
              "likes",
              profile?.uid
            ),
            {
              username: profile?.username,
            }
          );
        }
      } else {
        navigate("/login");
      }
    }
  
    async function deleteComment() {
      if (window.confirm("Are you sure you want to delete this comment?")) {
        deleteDoc(doc(db, "posts", originalPostId, "comments", commentId));
      }
    }
  
    return (
      <div className="flex p-3 cursor-pointer border-b border-gray-200 pl-20">
        {/* user image */}
        <img
          className="h-11 w-11 rounded-full mr-4"
          src={comment?.userImg}
          alt="user-img"
        />
        {/* right side */}
        <div className="flex-1">
          {/* Header */}
  
          <div className="flex items-center justify-between">
            {/* post user info */}
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {comment?.name}
              </h4>
              <span className="text-sm sm:text-[15px]">
                @{comment?.username} -{" "}
              </span>
              <span className="text-sm sm:text-[15px] hover:underline">
                <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
              </span>
            </div>
  
            {/* dot icon */}
            <EllipsisVerticalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 " />
          </div>
  
          {/* post text */}
  
          <p className="text-gray-800 text-[15px sm:text-[16px] mb-2">
            {comment?.comment}
          </p>
  
          {/* icons */}
  
          <div className="flex justify-between text-gray-500 p-2">
            <div className="flex items-center select-none">
              <ChatBubbleOvalLeftEllipsisIcon
                onClick={() => {
                  if (!profile) {
                    navigate("/signin");
                  } else {
                    setPostId(originalPostId);
                    setOpen(!open);
                  }
                }}
                className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
              />
            </div>
            {profile?.uid === comment?.userId && (
              <TrashIcon
                onClick={deleteComment}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            <div className="flex items-center">
              {hasLiked ? (
                <HeartIcon
                  onClick={likeComment}
                  className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
                />
              ) : (
                <Heartless
                  onClick={likeComment}
                  className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
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
  
            <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
            <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
          </div>
        </div>
      </div>
    );
  }