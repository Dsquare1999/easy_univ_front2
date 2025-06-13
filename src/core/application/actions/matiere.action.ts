"use client";

import { createAsyncThunk, Update } from "@reduxjs/toolkit";
import { z } from "zod";
import { MatiereSchema, CreateMatiereType, NoteSchema, ProgramSchema, ReportProgramSchema, UpdateMatiereType } from "../schemas";
import {
  matiereList,
  matiereCreate,
  matiereUpdate,
  matiereDelete,
  programCreate,
  programUpdate,
  programDelete,
  programReport,
  releveCreate,
  releveGenerate,
} from "@/core/infra/api";

export const matiereListAction = createAsyncThunk(
  "matiere/list",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const result = await dispatch(matiereList.initiate());
      if (result.error) {
        throw result.error;
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const matiereCreateAction = createAsyncThunk(
  "matiere/create",
  async (matiere: CreateMatiereType, { rejectWithValue, dispatch }) => {
    let matiereResult;
    await dispatch(
      matiereCreate.initiate(matiere)
    )
      .unwrap()
      .then((result) => {
        console.log("matiere create results");
        console.log(JSON.stringify(result));
        matiereResult = result;
      })
      .catch((error) => {
        console.log(error);
        matiereResult = error;
      });

    return matiereResult;
  }
);

export const matiereUpdateAction = createAsyncThunk(
  "matiere/update",
  async (matiere: UpdateMatiereType & { id: string }, { rejectWithValue, dispatch }) => {
    let matiereResult;
    await dispatch(
      matiereUpdate.initiate(matiere)
    )
      .unwrap()
      .then((result) => {
        console.log("matiere update results");
        console.log(JSON.stringify(result));
        matiereResult = result;
      })
      .catch((error) => {
        console.log(error);
        matiereResult = error;
      });

    return matiereResult;
  }
);

export const matiereDeleteAction = createAsyncThunk(
  "matiere/delete",
  async ({ id }: { id: string }, { rejectWithValue, dispatch }) => {
    let matiereResult;

    console.log("matiere delete action", id);
    await dispatch(matiereDelete.initiate({ id }))
      .unwrap()
      .then((result) => {
        console.log("matiere delete results");
        console.log(JSON.stringify(result));
        matiereResult = result;
      })
      .catch((error) => {
        console.log(error);
        matiereResult = error;
      });

    return matiereResult;
  }
);

export const programCreateAction = createAsyncThunk(
    "program/create",
    async (
      {
        classe,
        matiere,
        teacher,
        day,
        h_begin,
        h_end
      }: z.infer<typeof ProgramSchema>,
      { rejectWithValue, dispatch }
    ) => {
      let programResult;
      await dispatch(
        programCreate.initiate({
          classe,
          teacher,
          matiere,
          day,
          h_begin,
          h_end,
        })
      )
        .unwrap()
        .then((result) => {
          console.log("Program create results");
          console.log(JSON.stringify(result));
          programResult = result;
        })
        .catch((error) => {
          console.log(error);
          programResult = error;
        });
  
      return programResult;
    }
  );


  export const programUpdateAction = createAsyncThunk(
    "program/update",
    async (
      {
        id,
        classe,
        teacher,
        matiere,
        day,
        h_begin,
        h_end,
        status,
        observation
      }: z.infer<typeof ProgramSchema>,
      { rejectWithValue, dispatch }
    ) => {
      let programResult;
      await dispatch(
        programUpdate.initiate({
          id,
          classe,
          teacher,
          matiere,
          day,
          h_begin,
          h_end,
          status,
          observation
        })
      )
        .unwrap()
        .then((result) => {
          console.log("Program update results");
          console.log(JSON.stringify(result));
          programResult = result;
        })
        .catch((error) => {
          console.log(error);
          programResult = error;
        });
  
      return programResult;
    }
  );
  

  export const programDeleteAction = createAsyncThunk(
    "program/delete",
    async ({ id }: { id: string }, { rejectWithValue, dispatch }) => {
      let programResult;
  
      console.log("Program delete action", id);
      await dispatch(programDelete.initiate({ id }))
        .unwrap()
        .then((result) => {
          console.log("Program delete results");
          console.log(JSON.stringify(result));
          programResult = result;
        })
        .catch((error) => {
          console.log(error);
          programResult = error;
        });
  
      return programResult;
    }
  );

  
export const programReportAction = createAsyncThunk(
  "program/report",
  async (
    {
      reported_id,
      reported_observation,
      reported_status,
      classe,
      matiere,
      teacher,
      day,
      h_begin,
      h_end
    }: z.infer<typeof ReportProgramSchema>,
    { rejectWithValue, dispatch }
  ) => {
    let programResult;
    await dispatch(
      programReport.initiate({
        reported_id,
        reported_observation,
        reported_status,
        classe,
        teacher,
        matiere,
        day,
        h_begin,
        h_end,
      })
    )
      .unwrap()
      .then((result) => {
        console.log("Program report results");
        console.log(JSON.stringify(result));
        programResult = result;
      })
      .catch((error) => {
        console.log(error);
        programResult = error;
      });

    return programResult;
  }
);

export const releveCreateAction = createAsyncThunk(
  "releve/create",
  async (
    {examType, notes}: z.infer<typeof NoteSchema>,
    { rejectWithValue, dispatch }
  ) => {
    let releveResult;
    await dispatch(
      releveCreate.initiate({
        examType,
        notes
      })
    )
      .unwrap()
      .then((result) => {
        console.log("Releves updated results");
        console.log(JSON.stringify(result));
        releveResult = result;
      })
      .catch((error) => {
        console.log(error);
        releveResult = error;
      });

    return releveResult;
  }
);

export const releveGenerateAction = createAsyncThunk(
  "releve/generate",
  async (
    {id}: {id: string},
    { rejectWithValue, dispatch }
  ) => {
    let releveResult;
    await dispatch(
      releveGenerate.initiate({
        id
      })
    )
      .unwrap()
      .then((result) => {
        console.log("Relevés générés avec succès");
        console.log(JSON.stringify(result));
        releveResult = result;
      })
      .catch((error) => {
        console.log(error);
        releveResult = error;
      });

    return releveResult;
  }
);
