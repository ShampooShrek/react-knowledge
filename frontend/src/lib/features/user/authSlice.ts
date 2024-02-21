import User, { UserLogin } from "@/models/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import axios from "axios";

interface InitialStateType {
  isMenuVisible: boolean
  user: User | null
}

const initialState: InitialStateType = {
  isMenuVisible: false,
  user: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleMenu: (state, action: PayloadAction<boolean>) => {
      if (!state.user) {
        state.isMenuVisible = false
        return
      }

      if (state.isMenuVisible === undefined) {
        state.isMenuVisible = !state.isMenuVisible
      } else {
        state.isMenuVisible = action.payload
      }
    },
    setUser: (state, action: PayloadAction<UserLogin | null>) => {
      state.user = action.payload
      if (action.payload) {
        if (action.payload.token) {
          axios.defaults.headers.common.Authorization = `Bearer ${action.payload.token}`
          setCookie(null, "knowledge-token", action.payload.token, {
            maxAge: 60 * 60 * 24 * 7,
            path: "/"
          })
        }
      } else {
        delete axios.defaults.headers.common.Authorizatio
        destroyCookie(null, "knowledge-token")
        state.isMenuVisible = false
        window.location.replace("/auth/signIn")
      }
    },
  },

})

export const { toggleMenu, setUser } = authSlice.actions
export default authSlice.reducer


