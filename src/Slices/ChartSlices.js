import { createSlice } from '@reduxjs/toolkit'

export const charSlices = createSlice({
  name: 'chart',
  initialState: {
    charts: [],
  },
  reducers: {
    addImage: (state, action) => {
        state.charts.push(action.payload)
    },
    removeImage: (state, action) => {
      state.charts = state.charts.filter(c => c.id !== action.payload)
    }
  },
})

// Action creators are generated for each case reducer function
export const { addImage, removeImage } = charSlices.actions

export default charSlices.reducer