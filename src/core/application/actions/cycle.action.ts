"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { cycleCreate, cycleList } from "@/core/infra/api";
import { z } from "zod";
import { CycleSchema } from "../schemas";

export const cycleListAction = createAsyncThunk(
  "cycle/list",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const result = await dispatch(cycleList.initiate());
      if (result.error) {
        throw result.error;
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const cycleCreateAction = createAsyncThunk(
  "cycle/create",
  async ({name, description, duration} : z.infer<typeof CycleSchema>, { rejectWithValue, dispatch }) => {
    let cycleResult;
    await dispatch(cycleCreate.initiate({name, description, duration})).unwrap()
      .then((result)=> {
        console.log("Cycle create results")
        console.log(JSON.stringify(result))
        cycleResult = result
      })
      .catch((error)=> {
        console.log(error)
        cycleResult = error
      })

      return cycleResult;
  }
);