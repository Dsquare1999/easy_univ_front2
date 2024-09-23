"use client"

import { RequestEnum } from "@/core/domain/enums/request.enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FiliereEntity, FiliereState } from "@/core/domain/entities/filiere.entity";
import { filiereCreateAction, filiereListAction } from "../actions/filiere.action";

const initialState: FiliereState = {
    filieres: [],
    status: RequestEnum.PENDING,
}

const filiereSlice = createSlice({
  name: "filiere",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(filiereListAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(filiereListAction.fulfilled, (state, action) => {
      state.filieres.push(action.payload);
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(filiereListAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED;
    });
    
    builder.addCase(filiereCreateAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(filiereCreateAction.fulfilled, (state, action) => {
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(filiereCreateAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED
    });
  }
});

export default filiereSlice.reducer;