"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDetails, updateCover, useLoginMutation, useRegisterMutation } from "@/core/infra/api";
import axios from "axios";
import { CoverSchema, DetailSchema, RegistrationSchema } from "../schemas";
import { z } from "zod";
import { register } from "@/core/infra/api";

export const login = createAsyncThunk(
  "user/login",
  async (payload: { email: string; password: string }) => {
    console.log("Payload, c'est rentré", payload);
    const response = await axios.post(
      "http://localhost:8000/api/v1/auth/login/",
      { email: payload.email, password: payload.password }
    );
    
    if (response.status !== 200) {
      throw new Error("Failed to login");
    }
    console.log("Axios Response", response);
    // const [login, { isLoading }] = useLoginMutation();
    // try {
    //   const response = await login(payload);
    //   console.log("Response", response);
    // } catch (error: any) {
    //   return rejectWithValue(error.response?.data || error.message);
    // }

    // const { token, user } = response.data;
    // return { token, user };
    return response;
  }
);

// export const updateUserSession = createAsyncThunk(
//   'user/updateSession',
//   async (userData) => {
//     return userData;
//   }
// );

export const registerAction = createAsyncThunk(
  "user/register",
  async ({name, email, password} : z.infer<typeof RegistrationSchema>, {rejectWithValue, dispatch}) => {
    let registerResult;
      await dispatch(register.initiate({name, email, password})).unwrap()
        .then((result)=> {
          console.log(result)
          registerResult = result
        })
        .catch((error)=> {
          console.log(error)
          registerResult = error
        })

        return registerResult;
  }
);

export const addDetailsAction = createAsyncThunk(
  "user/details",
  async ({name, email, phone, bio, profile} : z.infer<typeof DetailSchema>, {rejectWithValue, dispatch}) => {
    let detailsResult;
      await dispatch(addDetails.initiate({name, email, phone, bio, profile})).unwrap()
        .then((result : any)=> {
          console.log(result)
          detailsResult = result
        })
        .catch((error : any)=> {
          console.log(error)
          detailsResult = error
        })

        return detailsResult;
  }
);

export const updateCoverAction = createAsyncThunk(
  "user/cover",
  async ({ cover }: z.infer<typeof CoverSchema> , {dispatch}) => {
    let coverResult;
    await dispatch(updateCover.initiate({cover})).unwrap()
      .then((result)=> {
        console.log(result)
        coverResult = result
      })
      .catch((error)=> {
        console.log(error)
        coverResult = error
      })

      return coverResult;
  }
);