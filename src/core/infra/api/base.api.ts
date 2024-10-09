import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout } from "@/core/application/slices/user.slice";
import { Mutex } from "async-mutex";
import { getCsrfToken, getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { store, AppDispatch } from "@/core/application/store";
import { authApi } from "../api/auth.api";

// create a new mutex
const mutex = new Mutex();
const baseURL = `${process.env.NEXT_PUBLIC_HOST}/api/v1`

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: 'include',
  prepareHeaders: async (headers) => {
    const session = await getSession();

    const accessToken = session?.accessToken ?? undefined;
    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    console.log("session found", session);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/v1/auth/refresh-token",
            method: "GET",
          },
          api,
          extraOptions
        );
        console.log("refreshResult", refreshResult);
        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions);
        } 
        
        // else {
        //   await store.dispatch(authApi.endpoints.logout.initiate()).unwrap()
        // }
        
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};


const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
	endpoints: builder => ({}),
});

export default api