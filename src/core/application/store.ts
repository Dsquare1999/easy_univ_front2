import { configureStore } from '@reduxjs/toolkit'
import { default as userReducer } from '@/core/application/slices/user.slice'
import { default as filiereReducer } from '@/core/application/slices/filiere.slice'
import { default as uniteReducer } from '@/core/application/slices/unite.slice'
import { default as cycleReducer } from '@/core/application/slices/cycle.slice'
import { default as classeReducer } from '@/core/application/slices/classe.slice'
import { default as tagReducer } from '@/core/application/slices/tag.slice'

import { api } from '../infra/api'

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        users: userReducer,
        filieres: filiereReducer,
        unites: uniteReducer,
        cycles: cycleReducer,
        classes: classeReducer,
        tags: tagReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    devTools: process.env.NODE_ENV !== 'production'
})  

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>