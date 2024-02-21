"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setUser, toggleMenu } from "@/lib/features/user/authSlice";
import Link from "next/link";
import UserDropDown from "./UserDropDown";
import { BarsIcon } from "@/components/icons";
import { useEffect } from "react";
import ApiResponse from "@/models/ApiResponse";
import User from "@/models/user";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import getUserByToken from "@/services/getUserByToken";

export default function Header() {
  const { data, isError, isLoading } = useQuery<
    ApiResponse<User>,
    AxiosError<ApiResponse<string>>
  >("authentication", getUserByToken);

  const dispatch = useAppDispatch();
  const { isMenuVisible: visible, user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (data && data.type === "success") {
      dispatch(setUser(data.response));
    }
  }, [data]);

  if (isError) dispatch(setUser(null));

  return (
    <header
      className={`w-full z-40 h-12 p-1 fixed top-0 left-0 
      flex items-center text-center justify-between bg-gradient-to-r from-mantle/90 to-surface/90`}
    >
      <div className="w-full">
        {user && (
          <a className="" onClick={() => dispatch(toggleMenu(!visible))}>
            <BarsIcon className="w-8 h-8 cursor-pointer" />
          </a>
        )}
      </div>
      <h3 className="text-xl text-white font-light w-full flex-grow text-center">
        <Link href="/" className="text-white text-lg">
          Base de Conhecimento!
        </Link>
      </h3>
      <div className="w-full flex justify-end">{user && <UserDropDown />}</div>
    </header>
  );
}
