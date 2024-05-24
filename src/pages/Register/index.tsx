import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { Schema, schema } from "../../utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { omit } from "lodash";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { AppContext } from "../../contexts/app.context";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

type FormData = Pick<Schema, "email" | "password" | "confirm_password">;
const registerSchema = schema.pick(["email", "password", "confirm_password"]);

const Register = () => {
  const {setIsAuthenticated} = useContext(AppContext)

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ["confirm_password"]);
    const email = body.email
    const password = body.password

    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      
      await setDoc(userDocRef, {
        name: user.displayName || "Anonymous",
        username: "@123Anonymous",
        email: user.email,
        uid: user.uid,
        userImg: user.photoURL || "",
        backGroundImg: "",
        timestamp: serverTimestamp()
      });
          
    navigate('/');
  })
    .catch((error) => {
      console.log(error);
    });

  });

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-2">Sign up now.</h2>

      <form
        className="rounded shadow-sm max-w-72 bg-transparent"
        onSubmit={onSubmit}
        noValidate
      >
        <Input
          name="email"
          register={register}
          type="email"
          className="mt-4"
          classNameInput="w-72 h-10  border-[1px] border-slate-300 1 bg-white font-semibold placeholder-gray-500 pl-4"
          errorMessage={errors.email?.message}
          placeholder="Email"
        />
        <Input
          name="password"
          register={register}
          type="password"
          className="mt-0"
          classNameInput="w-72 h-10  border-[1px] border-slate-300 1 bg-white font-semibold placeholder-gray-500 pl-4"
          errorMessage={errors.password?.message}
          placeholder="Password"
          autoComplete="on"
        />

        <Input
          name="confirm_password"
          register={register}
          type="password"
          className="mt-0"
          classNameInput="w-72 h-10  border-[1px] border-slate-300 1 bg-white font-semibold placeholder-gray-500 pl-4"
          errorMessage={errors.confirm_password?.message}
          placeholder="Confirm Password"
          autoComplete="on"
        />

        <div className="mt-2">
          <button className="w-72 h-10 rounded-3xl border-[1px] border-slate-300 mt-4 bg-white font-bold text-blue  hover:bg-sky-100 ">
            Sign up
          </button>
        </div>
        <div className="mt-8 flex justify-center ">
          <span className="text-gray-400">Already have an account?</span>
          <Link className="ml-1 text-blue" to="/login">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
