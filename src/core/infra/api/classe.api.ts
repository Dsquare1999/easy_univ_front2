import api from "./base.api";
import * as z from "zod";
import { ClasseSchema, MatiereSchema, StudentRefusalSchema, StudentSchema, StudentValidationSchema } from "@/core/application/schemas";
import { StudentType } from "@/core/application/schemas/classe.schema";

export const classeApi = api.injectEndpoints({
  endpoints: (builder) => ({
        classeList: builder.query<any, void>({
            query: () => ({
                url: "/classes",
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }: { id: string }) => ({ type: "Classes" as const, id })),
                        { type: "Classes", id: "LIST" },
                      ]
                    : [{ type: "Classes", id: "LIST" }],
        }),
        classeCreate: builder.mutation<any, {filiere: string, cycle: string, year: number, academic_year:string, parts: string}>({
            query: ({ filiere, cycle, year, academic_year, parts } : z.infer<typeof ClasseSchema>) => ({
                url: '/classes/store',
                method: 'POST',
                body: { filiere, cycle, year, academic_year, parts },
            }),
            invalidatesTags: [{ type: "Classes", id: "LIST" }],
        }),
        classeRetrieve: builder.query<any, {id: string}>({
            query: ({ id } : {id: string}) => ({
                url: `/classes/show/${id}`,
                method: 'GET',
            }),
        }),
        studentList: builder.query<any, void>({
            query: () => ({
                url: "/students",
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }: { id: string }) => ({ type: "Students" as const, id })),
                        { type: "Students", id: "LIST" },
                      ]
                    : [{ type: "Students", id: "LIST" }],
        }),
        studentCreate: builder.mutation<any, StudentType>({
            query: (student: StudentType) => ({
                url: '/students/store',
                method: 'POST',
                body: student,
            }),
            invalidatesTags: [{ type: "Students", id: "LIST" }],
        }),
        studentLeave: builder.mutation<any, {classe : string}>({
            query: (student : StudentType) => ({
                url: `/students/destroy/${student.classe}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { classe }) => [{ type: "Students", id: classe }],
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
        })

    }),
  overrideExisting: true,
});


