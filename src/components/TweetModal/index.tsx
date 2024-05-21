import { useContext, useRef, useState } from "react";
import Modal from "react-modal";
import { AppContext } from "../../contexts/app.context";
import { getAuth, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import {
  FaceSmileIcon,
  PhotoIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function TweetModal() {
  const [input, setInput] = useState("");
  const { profile, isAuthenticated, setIsAuthenticated, openTweet, setOpenTweet } =
    useContext(AppContext);
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const auth = getAuth();

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: profile?.uid,
      text: input,
      userImg: profile?.userImg,
      timestamp: serverTimestamp(),
      name: profile?.name,
      username: profile?.username,
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile("");
    setLoading(false);
    setOpenTweet(false)
    
  };

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target && readerEvent.target.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  function onSignOut() {
    signOut(auth);
  }

  return (
    <div>
      {openTweet && (
        <Modal
          isOpen={openTweet}
          onRequestClose={() => setOpenTweet(false)}
          className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md"
        >
          <div className="p-1">
            <div className="border-b border-gray-200 py-2 px-1.5">
              <div
                onClick={() => setOpenTweet(false)}
                className="hoverEffect w-10 h-10 flex items-center justify-center"
              >
                <XMarkIcon className="h-[23px] text-gray-700 p-0" />
              </div>
            </div>
            {profile && (
              <div className="flex border-b border-gray-200 p-3 space-x-3">
                <img
                  src={profile.userImg}
                  alt="user-img"
                  className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
                />
                <div className="w-full divide-y divide-gray-200">
                  <div className="">
                    <textarea
                      className="w-full border-none h-36 focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                      rows={2}
                      placeholder="What's happening?"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    ></textarea>
                  </div>

                  {selectedFile && (
                    <div className="relative">
                      <XCircleIcon
                        onClick={() => setSelectedFile("")}
                        className="border h-7 text-black absolute cursor-pointer shadow-md border-white m-1 rounded-full"
                      />
                      <img
                        src={selectedFile}
                        className={`${loading && "animate-pulse"}`}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2.5">
                    {!loading && (
                      <>
                        <div className="flex">
                          <div
                            className=""
                            onClick={() => filePickerRef.current?.click()}
                          >
                            <PhotoIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                            <input
                              type="file"
                              hidden
                              ref={filePickerRef}
                              onChange={addImageToPost}
                            />
                          </div>
                          <FaceSmileIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                        </div>
                        <button
                          onClick={sendPost}
                          disabled={!input.trim()}
                          className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                        >
                          Tweet
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
