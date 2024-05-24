import { doc, setDoc } from "firebase/firestore";
import React, { useContext } from "react";
import { db } from "../../firebase-config";
import { AppContext, UserData } from "../../contexts/app.context";

export type PartialUserData = Pick<UserData, 'name' | 'username' | 'userImg' | 'uid'>;

interface Props {
  user: PartialUserData | undefined;
  id: string | undefined;
  className?: string;
}

const FollowButton = ({
  user,
  id,
  className = "p-4 bg-white rounded-3xl w-28 h-9 py-1 ml-auto border-[1px] font-bold hover:bg-slate-100 border-stone-300 tracking-normal",
}: Props) => {
  const { profile } = useContext(AppContext);

  async function followUser(followerId: string, followingId: string) {
    if (user) {
      await setDoc(doc(db, "users", followerId, "following", id as string), {
        name: user.name,
        username: user.username,
        userImg: user.userImg,
        uid: user.uid,
      });
    }
    if (profile) {
      await setDoc(doc(db, "users", followingId, "followers", profile.uid), {
        name: profile.name,
        username: profile.username,
        userImg: profile.userImg,
        uid: profile.uid,
      });
    }
  }

  return (
    <button
      className={className}
      onClick={() => followUser(profile?.uid as string, id as string)}
    >
      Follow
    </button>
  );
};

export default FollowButton;
