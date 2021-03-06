import { createSlice } from '@reduxjs/toolkit'

export const sideBarSlice = createSlice({
  name: 'side_bar',
  initialState: {
    overviewVisible: true,
    networkVisible: false,
    lineageVisible: false,
    flowVisible: false,
    databaseVisible: false,
  },
  reducers: {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      toggle_overviewVisible: (state) => {
        console.log('sideBarSlice.toggle_overviewDomain')
        state.overviewVisible = !state.overviewVisible
      },
      toggle_networkVisible: (state) => {
        console.log('sideBarSlice.networkVisible')
        state.networkVisible = !state.networkVisible
      },
      toggle_lineageVisible: (state) => {
        console.log('sideBarSlice.lineageVisible')
        state.lineageVisible = !state.lineageVisible
      },
      toggle_flowVisible: (state) => {
        console.log('sideBarSlice.flowVisible')
        state.flowVisible = !state.flowVisible
      },
      toggle_databaseVisible: (state) => {
        console.log('sideBarSlice.databaseVisible')
        state.databaseVisible = !state.databaseVisible
      },
  }
})

export const { toggle_overviewVisible, toggle_networkVisible, toggle_lineageVisible, toggle_flowVisible, toggle_databaseVisible } = sideBarSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectDrawer = state => state.drawer.value

export default sideBarSlice.reducer

