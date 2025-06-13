import api from "./base.api";
import * as z from "zod";
import { UniteSchema, UniteCreateType, UniteType } from "@/core/application/schemas";

export const uniteApi = api.injectEndpoints({
  endpoints: (builder) => ({
        uniteList: builder.query<any, void>({
            query: () => ({
                url: "/unites",
                method: "GET",
            }),
        }),
        uniteCreate: builder.mutation<any, UniteCreateType>({
            query: (unite) => ({
                url: '/unites/store',
                method: 'POST',
                body: unite,
            }),
            invalidatesTags: [{ type: "Unites", id: "LIST" }],
        }),
    }),
  overrideExisting: true,
});


