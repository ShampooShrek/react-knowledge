import { ApiServiceResponse } from "@/models/ApiResponse";
import Articles from "@/models/articles";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface InitialStateType {
  articles: ApiServiceResponse<Articles[]> | null
}

const initialState: InitialStateType = {
  articles: null
}

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setAllArticles: (state, action: PayloadAction<ApiServiceResponse<Articles[]>>) => {
      state.articles = action.payload
    },
    addArticle: (state, action: PayloadAction<Articles>) => {
      if (!state.articles) return;
      state.articles = { ...state.articles, count: state.articles.count + 1 }
    },
    removeArticle: (state, action: PayloadAction<number>) => {
      if (!state.articles) return;
      const newData = state.articles.data.filter(d => d.id !== action.payload)
      state.articles = { ...state.articles, data: newData }
    },
    updateArticle: (state, action: PayloadAction<Articles>) => {
      if (!state.articles) return;
      const newData = state.articles.data
      const articleIndex = newData.findIndex(d => d.id === action.payload.id)
      if (articleIndex !== -1) {
        newData[articleIndex] = action.payload
        state.articles = { ...state.articles, data: newData }
      }
    }
  }
})

export const { updateArticle, addArticle, removeArticle, setAllArticles } = articleSlice.actions
export default articleSlice.reducer


