import { configureStore } from "@reduxjs/toolkit";
import { charSlices } from "./Slices/ChartSlices";
import { UploadedFileSlice } from "./Slices/UploadedFileSlice";
import { SideBarSlice } from "./Slices/SideBarSlice";

export default configureStore({
  reducer: {
    charts: charSlices.reducer,
    uploadedFile: UploadedFileSlice.reducer,
    sideBar: SideBarSlice.reducer,
  },
});
