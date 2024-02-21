import { ArrowDownIcon, LogoutIcon, SettingsIcon } from "@/components/icons";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { setUser } from "@/lib/features/user/authSlice";
import Link from "next/link";
import Gravatar from "react-gravatar";

export default function UserDropDown() {
  const { name, email, admin } = useAppSelector((state) => state.auth.user!);

  const dispatch = useAppDispatch();

  return (
    <div className="relative  flex justify-end hover:bg-black/20 cursor-pointer group">
      <div className="px-5 flex items-center text-white font-light h-full  ">
        <span className="hidden sm:inline lg:inline ">{name}</span>
        <div className="mx-3">
          <Gravatar className="h-10 w-10 rounded-e" email={email} alt="User" />
        </div>
        {admin && <ArrowDownIcon className="w-4 h-4" />}
      </div>
      <div
        className={`
        absolute right-0 bg-zinc-50 w-auto top-[100%] shadow-black p-2 z-10 flex flex-col flex-wrap opacity-0
        group-hover:opacity-100 transition-opacity duration-200 ease-in-out `}
      >
        {admin && (
          <Link
            className="p-2 text-black flex items-center hover:bg-zinc-200 cursor-pointer"
            href="/admin"
          >
            <SettingsIcon className="w-4 h-4 mr-2" /> Administração
          </Link>
        )}
        <span
          onClick={() => dispatch(setUser(null))}
          className="p-2 text-black flex items-center hover:bg-zinc-200 cursor-pointer"
        >
          <LogoutIcon className="w-4 h-4 mr-2" /> Logout
        </span>
      </div>
    </div>
  );
}
