import api from "./base.api";
import * as z from "zod";
import { ClasseSchema, StudentRefusalSchema, StudentSchema, StudentValidationSchema } from "@/core/application/schemas";

export const classeApi = api.injectEndpoints({
  endpoints: (builder) => ({
        classeList: builder.query<any, void>({
            query: () => ({
                url: "/classes",
                method: "GET",
            }),
        }),
        classeCreate: builder.mutation<any, {filiere: string, cycle: string, year: number}>({
            query: ({ filiere, cycle, year } : z.infer<typeof ClasseSchema>) => ({
                url: '/classes/store',
                method: 'POST',
                body: { filiere, cycle, year },
            }),
        }),
        studentList: builder.query<any, void>({
            query: () => ({
                url: "/students",
                method: "GET",
            }),
        }),
        studentCreate: builder.mutation<any, {classe: string}>({
            query: ({ classe } : z.infer<typeof StudentSchema>) => ({
                url: '/students/store',
                method: 'POST',
                body: { classe },
            }),
        }),
        studentLeave: builder.mutation<any, {classe: string}>({
            query: ({ classe } : z.infer<typeof StudentSchema>) => ({
                url: `/students/destroy/${classe}`,
                method: 'DELETE',
            }),
        }),
        studentValidate: builder.mutation<any, {tag: string, titre: string, student?: string}>({
            query: ({ tag, titre, student } : z.infer<typeof StudentValidationSchema>) => ({
                url: '/students/validate',
                method: 'POST',
                body: { tag, titre, student },
            }),
        }),
        studentRefuse: builder.mutation<any, {why: string, student?: string}>({
            query: ({ why, student } : z.infer<typeof StudentRefusalSchema>) => ({
                url: '/students/refuse',
                method: 'POST',
                body: { why, student },
            }),
        }),
        

    }),
  overrideExisting: true,
});


