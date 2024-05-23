import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  QueryDocumentSnapshot,
  collection,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../../firebase-config";

const FollowersList = () => {
  const [isFollowers, setIsFollowers] = useState(false);
  const [followers, setFollowers] = useState<QueryDocumentSnapshot[]>([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    onSnapshot(
      collection(db, "users", id as string, "followers"),
      (snapshot) => {
        setFollowers(snapshot.docs);
        console.log("here ar");
      }
    );
  }, []);

  const getLinkClass = () => {
    return `relative p-4 px-7 hover:after:absolute hover:after:content-[''] hover:font-bold hover:after:h-0.5 hover:after:w-full hover:after:bg-cyan-500 hover:after:bottom-0 hover:after:left-0`;
  };
  console.log(followers, "here are the followerssssssssssssssss");
  console.log(
    followers[0]?.data(),
    "here are the followerssssssssssssssss againn"
  );

  console.log(id, "i need to see the id will get ");
  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex items-center space-x-2  py-2 px-3 sticky top-0 z-50 bg-white  border-gray-200">
        <div className="hoverEffect" onClick={() => navigate("/")}>
          <ArrowLeftIcon className="h-5 " />
        </div>
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Tweet</h2>
      </div>

      <div className="flex mt-4 bg- bg-slate-100 border-b-[1px]">
        <Link
          to={`/profile/${id}/followers`}
          className={`${
            location.pathname === `/profile/${id}/followers`
              ? "text-black  font-bold  relative text-center p-4 px-7 after:absolute after:content-[''] after:h-0.5 flex-1 after:w-full  after:bg-cyan-500 after:bottom-0 after:left-0"
              : "text-black relative p-4 px-7 text-center flex-1 hover:after:absolute hover:after:content-[''] hover:font-bold hover:after:h-0.5 hover:after:w-full hover:after:bg-cyan-500 hover:after:bottom-0 hover:after:left-0"
          }`}
        >
          Followers
        </Link>

        <Link
          to={`/profile/${id}/following`}
          className={`${
            location.pathname === `/profile/${id}/following`
              ? "text-black font-bold relative p-4 px-7 flex-1 text-center after:absolute after:content-[''] after:h-0.5 after:w-full  after:bg-cyan-500 after:bottom-0 after:left-0 "
              : "text-black relative p-4 px-7 text-center flex-1 hover:after:absolute hover:after:content-[''] hover:font-bold hover:after:h-0.5 hover:after:w-full hover:after:bg-cyan-500 hover:after:bottom-0 hover:after:left-0"
          }`}
        >
          {" "}
          Following
        </Link>
      </div>
      {followers?.map((follower, index) => (
        <div className="bg-red-100 p-3 flex cursor-pointer hover:bg-slate-100" key={index}>
          <img src={follower.data().userImg} className="h-10 w-10 rounded-full" />
          <div>
            <div className="ml-3 text-base font-bold">{follower.data().name}</div>
            <div className="ml-3 text-sm">{follower.data().username}</div>
          </div>
          <button className="px-7 leading-3 h-8  bg-black font-bold text-white cursor-pointer hover:bg-slate-800 rounded-3xl ml-auto">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default FollowersList;
