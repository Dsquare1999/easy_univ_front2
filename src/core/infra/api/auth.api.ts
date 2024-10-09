import { CoverSchema, DetailSchema, LoginSchema, RegistrationSchema } from "@/core/application/schemas";
import api from "./base.api";
import * as z from "zod";
import { UserState } from "@/core/domain/entities/user.entity";
import { IdentiteEnum } from "@/core/domain/enums/user.enum";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, {email: string, password: string}>({
      query: ({ email, password } : z.infer<typeof LoginSchema>) => ({
				url: '/auth/login/',
				method: 'POST',
				body: { email, password },
			}),
    }),
    register: builder.mutation<any, {firstname: string, lastname: string, email: string, password: string}>({
      query: ({ firstname, lastname, email, password } : z.infer<typeof RegistrationSchema>) => ({
				url: '/auth/register/',
				method: 'POST',
				body: { firstname, lastname, email, password },
			}),
    }),
    addDetails: builder.mutation<any, { firstname: string; lastname: string; email: string; phone: string; bio?: string; profile?: File }>({
      query: ({ firstname, lastname, email, phone, bio, profile }) => {
        const formData = new FormData();
        
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
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
    userList: builder.query<any, void>({
      query: () => ({
          url: "/users",
          method: "GET",
      }),
      providesTags: ['User'],

    }),
    turnProfessor: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
				url: `/users/turnProfessor`,
				method: 'POST',
        body: { id },
			}),
      invalidatesTags: ['User'],
    }),
    turnStudent: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
				url: `/users/turnStudent`,
				method: 'POST',
        body: { id },
			}),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
				url: `/users/deleteUser/${id}`,
				method: 'DELETE',
			}),
      invalidatesTags: ['User'],
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


