"use client"

import { RequestEnum } from "@/core/domain/enums/request.enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ClasseState } from "@/core/domain/entities/classe.entity";
import { classeCreateAction, classeListAction, studentValidationAction } from "../actions/classe.action";

const initialState: ClasseState = {
    classes: [],
    status: RequestEnum.PENDING,
}

const classeSlice = createSlice({
  name: "classe",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(classeListAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(classeListAction.fulfilled, (state, action) => {
      state.classes.push(action.payload);
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(classeListAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED;
    });

    builder.addCase(classeCreateAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(classeCreateAction.fulfilled, (state, action) => {
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(classeCreateAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED
    });

    builder.addCase(studentValidationAction.fulfilled, (state, action) => {
      state.status = RequestEnum.FULFILLED;
    });

  },
});

export default classeSlice.reducer;