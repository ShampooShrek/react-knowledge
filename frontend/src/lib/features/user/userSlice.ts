import { ApiServiceResponse } from "@/models/ApiResponse";
import User from "@/models/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialStateType {
  users: User[] | null
}

const initialState: InitialStateType = {
  users: null
}

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAllUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },
    addUser: (state, action: PayloadAction<User>) => {
      if (!state.users) return;

      const newData = state.users
      newData.push(action.payload)
      state.users = newData
    },
    removeUser: (state, action: PayloadAction<number>) => {
      if (!state.users) return;
      const newData = state.users.filter(d => d.id !== action.payload)
      state.users = newData
    },
    updateUser: (state, action: PayloadAction<User>) => {
      if (!state.users) return;
      const newData = state.users
      const userIndex = newData.findIndex(d => d.id === action.payload.id)
      if (userIndex !== -1) {
        newData[userIndex] = action.payload
        state.users = newData
      }
    }
  }
})

export const { addUser, removeUser, updateUser, setAllUsers } = userSlice.actions
export default userSlice.reducer


