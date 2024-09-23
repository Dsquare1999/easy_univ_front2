"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { tagCreate, tagList } from "@/core/infra/api";
import { z } from "zod";
import { TagSchema } from "../schemas";

export const tagListAction = createAsyncThunk(
  "tag/list",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const result = await dispatch(tagList.initiate());
      if (result.error) {
        throw result.error;
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const tagCreateAction = createAsyncThunk(
  "tag/create",
  async ({name, fee} : z.infer<typeof TagSchema>, { rejectWithValue, dispatch }) => {
    let tagResult;
    await dispatch(tagCreate.initiate({name, fee})).unwrap()
      .then((result)=> {
        console.log("Tag create results")
        console.log(JSON.stringify(result))
        tagResult = result
      })
      .catch((error)=> {
        console.log(error)
        tagResult = error
      })

      return tagResult;
  }
);