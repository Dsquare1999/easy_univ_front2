"use client"

import { RequestEnum } from "@/core/domain/enums/request.enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { tagCreateAction, tagListAction } from "../actions/tag.action";
import { TagState } from "@/core/domain/entities/tag.entity";

const initialState: TagState = {
    tags: [],
    status: RequestEnum.PENDING,
}

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(tagListAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(tagListAction.fulfilled, (state, action) => {
      state.tags.push(action.payload);
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(tagListAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED;
    });

    builder.addCase(tagCreateAction.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(tagCreateAction.fulfilled, (state, action) => {
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(tagCreateAction.rejected, (state) => {
      state.status = RequestEnum.REJECTED
    });
  },
});

export default tagSlice.reducer;