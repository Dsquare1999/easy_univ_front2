import api from "./base.api";
import * as z from "zod";
import { FiliereSchema } from "@/core/application/schemas";

export const filiereApi = api.injectEndpoints({
  endpoints: (builder) => ({
        filiereList: builder.query<any, void>({
            query: () => ({
                url: "/filieres",
                method: "GET",
            }),
        }),
        filiereCreate: builder.mutation<any, {name: string, description: string}>({
            query: ({ name, description } : z.infer<typeof FiliereSchema>) => ({
                url: '/filieres/store',
                method: 'POST',
                body: { name, description },
            }),
        }),
    }),
  overrideExisting: true,
});


