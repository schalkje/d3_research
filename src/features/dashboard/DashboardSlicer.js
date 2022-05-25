import { createSlice } from '@reduxjs/toolkit'

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState: {
    visible: true,
    width: 300
  },
  reducers: {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      open: state => {
      state.visible = true
    },
    close: state => {
      state.visible = false
    },
    toggle: (state) => {
      console.log('drawerSlice.toggle')
      state.visible = !state.visible
      console.log('drawerSlice.toggle to ' + state.visible)
    }
  }
})

export const { open, close, toggle } = drawerSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectDrawer = state => state.drawer.visible

export default drawerSlice.reducer

