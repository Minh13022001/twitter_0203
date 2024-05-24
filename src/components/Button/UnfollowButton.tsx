import React, { useContext, useState } from 'react';
import Modal from "react-modal";
import { AppContext, UserData } from '../../contexts/app.context';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { PartialUserData } from './FollowButton';

interface Props {
    user: PartialUserData | undefined
    id: string | undefined
    className?: string
}



const UnFollowButton = ({  user, id, className = "p-4 bg-white rounded-3xl w-28 h-9 py-1 ml-auto border-[1px] font-bold hover:bg-red-100 hover:text-red-500 border-stone-300 tracking-normal hover:border-red-400" }: Props) => {
    const [showUnfollow, setShowUnfollow] = useState(false);
    const { profile } = useContext(AppContext);


    async function unFollowUser(followerId: string, followingId: string) {
        if (user) {
          await deleteDoc(doc(db, "users", followerId, "following", id as string));
        }
        if (profile) {
          await deleteDoc(doc(db, "users", followingId, "followers", profile.uid));
        }
        setShowUnfollow(false);
      }

    return (
        <div>
      <button
      onClick={()=> setShowUnfollow(true)}
      className={className}
      >
        Following
      </button>
         {showUnfollow && (
            <Modal
              isOpen={showUnfollow}
              onRequestClose={() => setShowUnfollow(false)}
              overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50"
              className="max-w-lg  absolute top-44 left-[50%]  translate-x-[-50%] bg-white border-2 border-gray-200 rounded-3xl shadow-md lg:max-w-[330px] lg:max-h-[400px] p-6 "
            >
              <div className="flex flex-col justify-center items-start ">
                <div className="text-xl font-extrabold pl-2">
                  Unfollow {user?.username} ?
                </div>
                <div className="mt-2 text-base  text-slate-500 pl-2 leading-6">
                  Their posts will no longer show up in your For You timeline. You
                  can still view their profile, unless their posts are protected.{" "}
                </div>
                <button
                  className="p-3 bg-black text-white w-full mt-5 rounded-3xl font-extrabold tracking-wide hover:bg-slate-800"
                  onClick={() => unFollowUser(profile?.uid as string, id as string)}
                >
                  Unfollow
                </button>
                <button
                  className="p-3 bg-white text-black w-full mt-3 rounded-3xl border-slate-300 border-[1px] font-extrabold tracking-wide hover:bg-slate-200"
                  onClick={() => setShowUnfollow(false)}
                >
                  Cancel
                </button>
              </div>
            </Modal>
          )}</div>
    );
  };
  
  export default UnFollowButton;
