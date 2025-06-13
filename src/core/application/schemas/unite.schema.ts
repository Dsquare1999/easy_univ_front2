import * as z from 'zod'

export const UniteSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1,{
      message: "Le nom de l unité d'enseignement est requis",
    }),
    slug: z.string().optional(),
    code: z.string().min(1, {
      message: "Le code de l unité d'enseignement est requis",
    }),
    description: z.string().min(1, {
      message: "La description de l unité d'enseignement est requise",
    }),
});
export const UniteCreateSchema = UniteSchema.omit({
    id: true,
    slug: true,
});
export const UniteUpdateSchema = UniteSchema.omit({
    slug: true,
});

export type UniteType = z.infer<typeof UniteSchema>;
export type UniteCreateType = z.infer<typeof UniteCreateSchema>;
export type UniteUpdateType = z.infer<typeof UniteUpdateSchema>;  