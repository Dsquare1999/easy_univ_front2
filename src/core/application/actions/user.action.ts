"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDetails, deleteUser, turnProfessor, turnStudent, updateCover, useLoginMutation, useRegisterMutation, userList } from "@/core/infra/api";
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
  async ({firstname, lastname, email, password} : z.infer<typeof RegistrationSchema>, {rejectWithValue, dispatch}) => {
    let registerResult;
      await dispatch(register.initiate({firstname, lastname, email, password})).unwrap()
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
  async ({firstname, lastname, email, phone, bio, profile} : z.infer<typeof DetailSchema>, {rejectWithValue, dispatch}) => {
    let detailsResult;
      await dispatch(addDetails.initiate({firstname, lastname, email, phone, bio, profile})).unwrap()
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

export const usersListAction = createAsyncThunk(
  "user/list",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const result = await dispatch(userList.initiate(
        undefined,{
          forceRefetch: true, 
        }
      )).unwrap();
      if (result.error) {
        throw result.error;
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const turnProfessorAction = createAsyncThunk
(
  "user/turnProfessor", async ({ id } : { id: string} , {dispatch}) => {
    let turnResult;
    await dispatch(turnProfessor.initiate({id})).unwrap()
      .then((result)=> {
        console.log(result)
        turnResult = result
      })
      .catch((error)=> {
        console.log(error)
        turnResult = error
      })

      return turnResult;
  }
);

export const turnStudentAction = createAsyncThunk
(
  "user/turnStudent", async ({ id }: { id: string } , {dispatch}) => {
    let turnResult;
    await dispatch(turnStudent.initiate({id})).unwrap()
      .then((result)=> {
        console.log(result)
        turnResult = result
      })
      .catch((error)=> {
        console.log(error)
        turnResult = error
      })

      return turnResult;
  }
);

export const deleteUserAction = createAsyncThunk
(
  "user/deleteUser", async ({ id }: { id: string } , {dispatch}) => {
    let deleteUserResult;
    await dispatch(deleteUser.initiate({id})).unwrap()
      .then((result)=> {
        console.log(result)
        deleteUserResult = result
      })
      .catch((error)=> {
        console.log(error)
        deleteUserResult = error
      })

      return deleteUserResult;
  }
);
