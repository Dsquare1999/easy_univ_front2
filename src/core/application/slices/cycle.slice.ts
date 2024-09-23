"use client"

import { RequestEnum } from "@/core/domain/enums/request.enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CycleState } from "@/core/domain/entities/cycle.entity";
import { cycleCreateAction, cycleListAction } from "../actions/cycle.action";

const initialState: CycleState = {
    cycles: [],
    status: RequestEnum.PENDING,
}

const cycleSlice = createSlice({
  name: "cycle",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(cycleListAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(cycleListAction.fulfilled, (state, action) => {
      state.cycles.push(action.payload);
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(cycleListAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED;
    });

    builder.addCase(cycleCreateAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(cycleCreateAction.fulfilled, (state, action) => {
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(cycleCreateAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED
    });
  },
});

export default cycleSlice.reducer;