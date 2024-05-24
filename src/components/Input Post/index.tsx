import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useContext, useRef, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  PhotoIcon,
  FaceSmileIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { AppContext } from "../../contexts/app.context";



export default function InputPost() {
  const [input, setInput] = useState("");
  const { profile, isAuthenticated, setIsAuthenticated } = useContext(AppContext);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const auth = getAuth();

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: profile?.uid,
      text: input,
      images: selectedFiles,
      userImg: profile?.userImg,
      timestamp: serverTimestamp(),
      name: profile?.name,
      username: profile?.username,
    });


    setInput("");
    setSelectedFiles([]);
    setLoading(false);
  };

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 4 - selectedFiles.length); // Limit to remaining slots
      const readers = fileArray.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return reader;
      });

      Promise.all(readers.map(reader => {
        return new Promise<string>((resolve, reject) => {
          reader.onload = (readerEvent) => {
            if (readerEvent.target && readerEvent.target.result) {
              resolve(readerEvent.target.result as string);
            }
          };
        });
      })).then(results => {
        setSelectedFiles(prevFiles => [...prevFiles, ...results]);
      });
    }
  };

  function onSignOut() {
    signOut(auth);
  }

  return (
    <>
      {profile && (
        <div className="flex border-b border-gray-200 p-3 space-x-3">
          <img
            onClick={onSignOut}
            src={profile?.userImg === "" ? "https://akns-images.eonline.com/eol_images/Entire_Site/2013726/rs_634x1024-130826130030-634.mileytongue.cm.82613_copy.jpg?fit=around%7C634:1024&output-quality=90&crop=634:1024;center,top" : profile.userImg}
            alt="user-img"
            className="h-11 w-11 rounded-full object-cover cursor-pointer hover:brightness-95"
          />

          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                rows={2}
                placeholder="What's happening?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>

            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative m-2">
                    <XCircleIcon
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                      className="border h-7 text-black absolute cursor-pointer shadow-md border-white m-1 rounded-full"
                    />
                    <img
                      src={file}
                      alt={`Selected ${index}`}
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                ))}
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
                        multiple
                        ref={filePickerRef}
                        onChange={addImageToPost}
                        accept="image/*"
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
    </>
  );
}


