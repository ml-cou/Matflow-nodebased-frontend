import { configureStore } from '@reduxjs/toolkit'
import { charSlices } from './Slices/ChartSlices'

export default configureStore({
  reducer: {
    charts: charSlices.reducer
  },
})