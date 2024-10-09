import * as z from 'zod'

export const CycleSchema = z.object({
    name: z.string().min(1, {
      message: "Le nom du cycle est requis",
    }),
    description: z.string().min(1, {
      message: "La description du cycle est requise",
    }),
    duration: z.number().int().positive({
        message: "La durée du cycle doit étre positive et entière",
    }),
});
