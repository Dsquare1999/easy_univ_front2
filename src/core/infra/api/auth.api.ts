import { CoverSchema, DetailSchema, LoginSchema, RegistrationSchema } from "@/core/application/schemas";
import api from "./base.api";
import * as z from "zod";
import { UserState } from "@/core/domain/entities/user.entity";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, {email: string, password: string}>({
      query: ({ email, password } : z.infer<typeof LoginSchema>) => ({
				url: '/auth/login/',
				method: 'POST',
				body: { email, password },
			}),
    }),
    register: builder.mutation<any, {name: string, email: string, password: string}>({
      query: ({ name, email, password } : z.infer<typeof RegistrationSchema>) => ({
				url: '/auth/register/',
				method: 'POST',
				body: { name, email, password },
			}),
    }),
    addDetails: builder.mutation<any, { name: string; email: string; phone: string; bio?: string; profile?: File }>({
      query: ({ name, email, phone, bio, profile }) => {
        const formData = new FormData();
        
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        if (bio) formData.append('bio', bio);
        if (profile) formData.append('profile', profile);
    
        return {
          url: '/auth/update/',
          method: 'POST',
          body: formData, 
        };
      },
    }),
    updateCover: builder.mutation<any, { cover: File }>({
      query: ({cover} : z.infer<typeof CoverSchema>) => {
        const formData = new FormData();
        formData.append('cover', cover);
        return {
          url: '/auth/updateCover/',
          method: 'POST',
          body: formData, 
        };
      },
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});


