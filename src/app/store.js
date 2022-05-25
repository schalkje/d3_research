import { configureStore } from '@reduxjs/toolkit'
import drawerSlice from '../features/dashboard/DashboardSlicer'
import sideBarSlice from '../features/dashboard/SidebarSlicer'

export default configureStore({ 
  reducer: {
    drawer: drawerSlice,
    side_bar: sideBarSlice 
  }
})


