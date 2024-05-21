import { useState } from "react";
import img from "../../assets/kindpng_373094.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { omit } from "lodash";
import Input from "../../components/Input";
import { Schema, schema } from "../../utils/rules";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}
type FormData = Pick<Schema, "email" | "password" | "confirm_password">;
const registerSchema = schema.pick(["email", "password", "confirm_password"]);

export default function RegisterLayout({children} : Props) {


  // const closeEditModal = () => setVisible(false);
  // const openEditModal = (index: number) => {
  //   setVisible(true);
  //   console.log("opening edit modal");
  // };


  return (
    <div className="relative">
      <div className="  grid grid-cols-7  z-10 top-0 absolute left-0">
        <div className="col-span-4 items-center justify-center flex">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-[350px] w-[350px]"
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </div>
        <div className="col-span-3 p-6 flex flex-col pb-0">
          <h1 className=" text-[70px]  mt-12 font-extrabold mb-8 tracking-wide leading-[90px]">
            WHAT'S NOW !
          </h1>
          {children}

          {/* <img src={img} className="absolute overflow-x-hidden bottom-[-140px] left-[140px] opacity-10 w-[960px] h-[890px]"/> */}
        </div>


        <footer className="bg-gray-800 text-gray-300 py-1 w-full h-8 fixed bottom-0">
          <div className=" mx-auto flex justify-between items-center">
            <div>
              <span>&copy; 2024 Your Company</span>
            </div>
            <div>
              <a href="#" className="text-gray-300 hover:text-white">
                Terms of Service
              </a>
              <span className="mx-2">|</span>
              <a href="#" className="text-gray-300 hover:text-white mr-3">
                Privacy Policy
              </a>
            </div>
          </div>
        </footer>
      </div>
      <img src={img} className=" opacity-10 w-[1360px] h-[620px] mt-3" />
    </div>
  );
}
