import { ApiServiceResponse } from "@/models/ApiResponse";
import { CategoryWithPath } from "@/models/category";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface InitialStateType {
  categories: CategoryWithPath[] | null
}

const initialState: InitialStateType = {
  categories: null
}

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setAllCategories: (state, action: PayloadAction<CategoryWithPath[]>) => {
      state.categories = action.payload
    },
    addCategory: (state, action: PayloadAction<CategoryWithPath>) => {
      if (!state.categories) return;

      const newData = state.categories
      newData.push(action.payload)
      state.categories = newData
    },
    removeCategory: (state, action: PayloadAction<number>) => {
      if (!state.categories) return;
      const newData = state.categories.filter(d => d.id !== action.payload)
      state.categories = newData
    },
    updateCategory: (state, action: PayloadAction<CategoryWithPath>) => {
      if (!state.categories) return;
      const categoryIndex = state.categories.findIndex(d => d.id === action.payload.id)
      if (categoryIndex !== -1) {
        let updatedCategories = [...state.categories]
        updatedCategories[categoryIndex] = action.payload
        const name = state.categories[categoryIndex].name
        const updatedName = action.payload.name

        updatedCategories = updatedCategories.map(cat => {
          const splitedPath = cat.path.split(" > ")
          console.log(splitedPath)
          if (splitedPath.includes(name)) {
            const index = splitedPath.findIndex(str => str === name)
            console.log(index)
            splitedPath[index] = updatedName
            const splitedToStr = splitedPath.join(" > ")
            console.log(splitedToStr)
            return { ...cat, path: splitedToStr }
          } else {
            return cat
          }
        })
        state.categories = updatedCategories
      }
    }
  }
})

export const { addCategory, removeCategory, updateCategory, setAllCategories } = categorySlice.actions
export default categorySlice.reducer


