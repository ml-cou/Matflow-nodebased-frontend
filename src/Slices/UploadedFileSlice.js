import { createSlice } from "@reduxjs/toolkit";

export const UploadedFileSlice = createSlice({
  name: "uploadedFile",
  initialState: {
    activeFile: "",
    rerender: false
  },
  reducers: {
    setActiveFile: (state, { payload }) => {
      state.activeFile = payload;
    },
    setReRender: (state, {payload}) => {
      state.rerender = payload
    }
  },
});

// Action creators are generated for each case reducer function
export const { setActiveFile, setReRender } = UploadedFileSlice.actions;

export default UploadedFileSlice.reducer;
