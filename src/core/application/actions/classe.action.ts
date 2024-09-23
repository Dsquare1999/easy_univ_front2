"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { classeCreate, classeList, studentCreate, studentLeave, studentList, studentRefuse, studentValidate } from "@/core/infra/api";
import { z } from "zod";
import { ClasseSchema, StudentRefusalSchema, StudentSchema, StudentValidationSchema } from "../schemas";

export const classeListAction = createAsyncThunk(
  "classe/list",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const result = await dispatch(classeList.initiate());
      if (result.error) {
        throw result.error;
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const classeCreateAction = createAsyncThunk(
  "classe/create",
  async ({filiere, cycle, year} : z.infer<typeof ClasseSchema>, { rejectWithValue, dispatch }) => {
    let classeResult;
    await dispatch(classeCreate.initiate({filiere, cycle, year})).unwrap()
      .then((result)=> {
        console.log("Classe create results")
        console.log(JSON.stringify(result))
        classeResult = result
      })
      .catch((error)=> {
        console.log(error)
        classeResult = error
      })

      return classeResult;
  }
);


export const studentListAction = createAsyncThunk(
  "student/list",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const result = await dispatch(studentList.initiate());
      if (result.error) {
        throw result.error;
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const studentCreateAction = createAsyncThunk(
  "student/create",
  async ({classe} : z.infer<typeof StudentSchema>, { rejectWithValue, dispatch }) => {
    let classeResult;
    await dispatch(studentCreate.initiate({classe})).unwrap()
      .then((result)=> {
        console.log("Student create results")
        console.log(JSON.stringify(result))
        classeResult = result
      })
      .catch((error)=> {
        console.log(error)
        classeResult = error
      })

      return classeResult;
  }
);

export const studentLeaveAction = createAsyncThunk(
  "student/leave",
  async ({classe} : z.infer<typeof StudentSchema>, { rejectWithValue, dispatch }) => {
    let classeResult;
    await dispatch(studentLeave.initiate({classe})).unwrap()
      .then((result)=> {
        console.log("Student left results")
        console.log(JSON.stringify(result))
        classeResult = result
      })
      .catch((error)=> {
        console.log(error)
        classeResult = error
      })

      return classeResult;
  }
);

export const studentValidationAction = createAsyncThunk(
  "student/validation",
  async ({tag, titre, student} : z.infer<typeof StudentValidationSchema>, { rejectWithValue, dispatch }) => {
    let validationResult;
    await dispatch(studentValidate.initiate({tag, titre, student})).unwrap()
      .then((result)=> {
        console.log("Student validation successful")
        console.log(JSON.stringify(result))
        validationResult = result
      })
      .catch((error)=> {
        console.log(error)
        validationResult = error
      })

      return validationResult;
  }
);

export const studentRefusalAction = createAsyncThunk(
  "student/refusal",
  async ({why, student} : z.infer<typeof StudentRefusalSchema>, { rejectWithValue, dispatch }) => {
    let validationResult;
    await dispatch(studentRefuse.initiate({why, student})).unwrap()
      .then((result)=> {
        console.log("Student refusal successful")
        console.log(JSON.stringify(result))
        validationResult = result
      })
      .catch((error)=> {
        console.log(error)
        validationResult = error
      })

      return validationResult;
  }
);