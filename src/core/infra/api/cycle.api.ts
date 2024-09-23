import api from "./base.api";
import * as z from "zod";
import { CycleSchema } from "@/core/application/schemas";

export const cycleApi = api.injectEndpoints({
  endpoints: (builder) => ({
        cycleList: builder.query<any, void>({
            query: () => ({
                url: "/cycles",
                method: "GET",
            }),
        }),
        cycleCreate: builder.mutation<any, {name: string, description: string, duration: number}>({
            query: ({ name, description, duration } : z.infer<typeof CycleSchema>) => ({
                url: '/cycles/store',
                method: 'POST',
                body: { name, description, duration },
            }),
        }),
    }),
  overrideExisting: true,
});


