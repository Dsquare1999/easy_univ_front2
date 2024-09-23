"use client"

import { UserState } from "@/core/domain/entities/user.entity";
import { RequestEnum } from "@/core/domain/enums/request.enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addDetailsAction, login, registerAction, updateCoverAction } from "../actions/user.action";

const initialState: UserState = {
  isLoggedIn: false,
  status: RequestEnum.PENDING,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.status = RequestEnum.PENDING;
    },
    setStatus: (state, action: PayloadAction<UserState["status"]>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.isLoggedIn = true;
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(login.rejected, (state) => {
      state.status = RequestEnum.REJECTED;
    });

    builder.addCase(registerAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(registerAction.fulfilled, (state) => {
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(registerAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED;
    });

    builder.addCase(updateCoverAction.fulfilled, (state, action) => {
      state.status = RequestEnum.FULFILLED;
    });

    builder.addCase(addDetailsAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(addDetailsAction.fulfilled, (state) => {
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(addDetailsAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED;
    });
  },
});


export const { logout, setStatus } = userSlice.actions;
export default userSlice.reducer;