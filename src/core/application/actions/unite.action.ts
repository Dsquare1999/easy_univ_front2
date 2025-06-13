"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { uniteCreate, uniteList } from "@/core/infra/api";
import { UniteType } from "../schemas";

export const uniteListAction = createAsyncThunk(
  "unite/list",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const result = await dispatch(uniteList.initiate());
      if (result.error) {
        throw result.error;
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uniteCreateAction = createAsyncThunk(
  "unite/create",
  async (unite : UniteType, { rejectWithValue, dispatch }) => {
    let uniteResult;
    await dispatch(uniteCreate.initiate(unite)).unwrap()
      .then((result)=> {
        console.log("Unite create results")
        console.log(JSON.stringify(result))
        uniteResult = result
      })
      .catch((error)=> {
        console.log(error)
        uniteResult = error
      })

      return uniteResult;
  }
);