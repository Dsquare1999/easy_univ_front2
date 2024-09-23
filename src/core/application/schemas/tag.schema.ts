import * as z from 'zod'

export const TagSchema = z.object({
    name: z.string().min(1, {
      message: "Le nom du tag est requis",
    }),
    fee: z.number().positive({
        message: "Les frais associés au tag doivent être positifs",
    }),
});