import * as z from 'zod'

export const FiliereSchema = z.object({
    name: z.string().min(1,{
      message: "Le nom de la filière est requis",
    }),
    description: z.string().min(1, {
      message: "La description de la filière est requise",
    }),
});