"use client"

import { RequestEnum } from "@/core/domain/enums/request.enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UniteEntity, UniteState } from "@/core/domain/entities/unite.entity";
import { uniteCreateAction, uniteListAction } from "@/core/application/actions/unite.action";

const initialState: UniteState = {
    unites: [],
    status: RequestEnum.PENDING,
}

const uniteSlice = createSlice({
  name: "unite",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(uniteListAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(uniteListAction.fulfilled, (state, action) => {
      state.unites.push(action.payload);
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(uniteListAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED;
    });
    
    builder.addCase(uniteCreateAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(uniteCreateAction.fulfilled, (state, action) => {
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(uniteCreateAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED
    });
  }
});

export default uniteSlice.reducer;