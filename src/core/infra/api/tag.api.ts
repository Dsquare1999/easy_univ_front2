import api from "./base.api";
import * as z from "zod";
import { TagSchema } from "@/core/application/schemas";

export const tagApi = api.injectEndpoints({
  endpoints: (builder) => ({
        tagList: builder.query<any, void>({
            query: () => ({
                url: "/tags",
                method: "GET",
            }),
        }),
        tagCreate: builder.mutation<any, {name: string, fee: number}>({
            query: ({ name, fee } : z.infer<typeof TagSchema>) => ({
                url: '/tags/store',
                method: 'POST',
                body: { name, fee },
            }),
        }),
    }),
  overrideExisting: true,
});


