import React, { useContext } from "react";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { omit } from "lodash";
import { Schema, schema } from "../../utils/rules";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase-config";
import { AppContext } from "../../contexts/app.context";

type FormData = Pick<Schema, "email" | "password">;
const loginSchema = schema.pick(["email", "password"]);

const Login = () => {
  const { setProfile, setIsAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = handleSubmit((data) => {

    const email = data.email;
    const password = data.password;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // setProfile(userCredential.user.email)
        // setIsAuthenticated(true)
        navigate('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
            setError("password", {
              message: "Sai email hoặc mật khẩu",
              type: "Server",
            });
          }
        
        const errorMessage = error.message;
        console.log(errorMessage , "this is error");
      });
  });

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-2">Sign in now.</h2>

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
          className="mt-1"
          classNameInput="w-72 h-10  border-[1px] border-slate-300 1 bg-white font-semibold placeholder-gray-500 pl-4"
          errorMessage={errors.password?.message}
          placeholder="Password"
          autoComplete="on"
        />

        <div className="mt-2">
          <button className="w-72 h-10 rounded-3xl border-[1px] border-slate-300  bg-white font-bold text-blue  hover:bg-sky-100 ">
            Sign in
          </button>
        </div>
        <div className="flex mt-4 max-w-72">
          <div className="w-72 h-[1px] bg-gray-400 mt-4"></div>
          <div className="ml-2 mr-2 text-base font-light text-black"> or</div>
          <div className="w-72 h-[1px] bg-gray-400 mt-4"></div>
        </div>
        <button className="w-72 bg-white h-10 rounded-3xl border-[1px] border-slate-300 relative font-bold hover:bg-sky-100 cursor-pointer mt-4">
          Sign in with Google
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-[15px] w-[15px] absolute top-[11px] left-[58px] "
          >
            <g>
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </g>
          </svg>
        </button>

        <div className="mt-8 flex justify-center ">
          <span className="text-gray-400">Already have an account?</span>
          <Link className="ml-1 text-blue" to="/register">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;


// save accessToken