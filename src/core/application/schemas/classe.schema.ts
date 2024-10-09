import * as z from 'zod'

export const ClasseSchema = z.object({
    filiere: z.string().min(1, {
      message: "La filiere est requise",
    }),
    cycle: z.string().min(1, {
      message: "Le cycle est requis",
    }),
    year: z.number().int().positive({
        message: "L'année doit être positive et entière",
    }),
});

export const StudentSchema = z.object({
    classe: z.string().min(1, {
      message: "La classe est requise",
    }),
});

export const StudentValidationSchema = z.object({
  tag: z.string().min(1, {
    message: "Le tag est requis",
  }),
  titre: z.string().min(1, {
    message: "Le titre est requis",
  }),
  student: z.string().optional()
});

export const StudentRefusalSchema = z.object({
  why: z.string().min(1, {
    message: "La raison du refus est requise",
  }),
  student: z.string().optional()
});

