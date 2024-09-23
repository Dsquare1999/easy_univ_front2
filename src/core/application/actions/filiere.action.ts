"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { filiereCreate, filiereList } from "@/core/infra/api";
import { z } from "zod";
import { FiliereSchema } from "../schemas";

export const filiereListAction = createAsyncThunk(
  "filiere/list",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const result = await dispatch(filiereList.initiate());
      if (result.error) {
        throw result.error;
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const filiereCreateAction = createAsyncThunk(
  "filiere/create",
  async ({name, description} : z.infer<typeof FiliereSchema>, { rejectWithValue, dispatch }) => {
    let filiereResult;
    await dispatch(filiereCreate.initiate({name, description})).unwrap()
      .then((result)=> {
        console.log("filiere create results")
        console.log(JSON.stringify(result))
        filiereResult = result
      })
      .catch((error)=> {
        console.log(error)
        filiereResult = error
      })

      return filiereResult;
  }
);