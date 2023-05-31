import { createSlice } from "@reduxjs/toolkit";

export const UploadedFileSlice = createSlice({
  name: "uploadedFile",
  initialState: {
    activeFile: "",
  },
  reducers: {
    setActiveFile: (state, { payload }) => {
      state.activeFile = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActiveFile } = UploadedFileSlice.actions;

export default UploadedFileSlice.reducer;
