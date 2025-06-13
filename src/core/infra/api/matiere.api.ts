import api from "./base.api";
import * as z from "zod";
import { CreateMatiereType, MatiereSchema, NoteSchema, ProgramSchema, ReportProgramSchema, UpdateMatiereType } from "@/core/application/schemas";

export const matiereApi = api.injectEndpoints({
  endpoints: (builder) => ({
        matiereList: builder.query<any, void>({
            query: () => ({
                url: "/matieres",
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }: { id: string }) => ({ type: "Matieres" as const, id })),
                        { type: "Matieres", id: "LIST" },
                      ]
                    : [{ type: "Matieres", id: "LIST" }],
        }),
        matiereCreate: builder.mutation<any, CreateMatiereType>({
            query: (matiere : CreateMatiereType) => ({
                url: '/matieres/store',
                method: 'POST',
                body: matiere,
            }),
            invalidatesTags: [{ type: "Matieres", id: "LIST" }],
        }),
        matiereUpdate: builder.mutation<any, UpdateMatiereType & { id: string }>({
            query: ({id, ...matiere}) => ({
                url: `/matieres/update/${id}`,
                method: 'PUT',
                body: matiere
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Matieres", id }],
        }),
        matiereDelete: builder.mutation<any, {id: string}>({
            query: ({ id } : {id: string}) => ({
                url: `/matieres/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Matieres", id }],
        }),
        programCreate: builder.mutation<any, {classe?: string, teacher?: string, matiere?: string, day: string, h_begin: string, h_end: string}>({
            query: ({ classe, teacher, matiere, day, h_begin, h_end } : z.infer<typeof ProgramSchema>) => ({
                url: '/programs/store',
                method: 'POST',
                body: { classe, teacher, matiere, day, h_begin, h_end },
            }),
        }),
        programUpdate: builder.mutation<any, {id?:string, status?:string, observation?:string, classe?: string, teacher?: string, matiere?: string, day: string, h_begin: string, h_end: string}>({
            query: ({ id, classe, teacher, matiere, day, h_begin, h_end, status, observation } : z.infer<typeof ProgramSchema>) => ({
                url: `/programs/update/${id}`,
                method: 'PATCH',
                body: { classe, teacher, matiere, day, h_begin, h_end, status, observation },
            }),
        }),
        programDelete: builder.mutation<any, {id: string}>({
            query: ({ id } : {id: string}) => ({
                url: `/programs/destroy/${id}`,
                method: 'DELETE',
            }),
        }),
        programReport: builder.mutation<any, z.infer<typeof ReportProgramSchema>>({
            query: ({ reported_id, reported_observation, reported_status, classe, teacher, matiere, day, h_begin, h_end }) => ({
                url: '/programs/report',
                method: 'POST',
                body: { reported_id, reported_observation, reported_status, classe, teacher, matiere, day, h_begin, h_end },
            }),
        }),
        releveCreate: builder.mutation<any, z.infer<typeof NoteSchema>>({
            query: ({ examType, notes }) => ({
                url: '/releves/mark',
                method: 'POST',
                body: { examType, notes },
            }),
        }),
        releveGenerate: builder.mutation<any, {id: string}>({
            query: ({ id } : {id: string}) => ({
                url: `/releves/generate/${id}`,
                method: 'POST',
            }),
        }),
    }),
  overrideExisting: true,
});