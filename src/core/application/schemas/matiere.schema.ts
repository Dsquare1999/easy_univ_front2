import * as z from 'zod';


export const MatiereSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, {
      message: "Le nom de la matière est requis",
    }),
    code: z.string().min(1, {
      message: "Le code de la matière est requis",
    }),
    classe: z.string().optional(),
    teacher: z.string().optional(),
    hours: z.number().int().positive({
        message: "Le quotat horaire doit être positif et entier",
    }),
    coefficient: z.number().int().positive({
        message: "Le coefficient de la matière doit être positif et entier",
    }),
    year_part: z.number().int().positive({
      message: "La partie du cycle de la matière doit être positif et entier",
    }),
  });

export const ProgramSchema = z.object({
    id: z.string().optional(),
    classe: z.string().optional(),
    teacher: z.string().optional(),
    matiere: z.string().optional(),
    day: z.string().min(1, { message: "Veuillez sélectionner un jour." }),
    h_begin: z.string().min(1, { message: "Veuillez entrer une heure de début." }),
    h_end: z.string().min(1, { message: "Veuillez entrer une heure de fin." }),
    status: z.string().optional(),
    observation: z.string().optional(),
}).superRefine((data, ctx) => {
    if (new Date(`1970-01-01T${data.h_end}`) <= new Date(`1970-01-01T${data.h_begin}`)) {
      ctx.addIssue({
        path: ['h_end'],
        message: "L'heure de fin doit être supérieure à l'heure de début.",
        code: "custom",
      });
    }
});

export const ReportProgramSchema = z.object({
  classe: z.string().optional(),
  teacher: z.string().optional(),
  matiere: z.string().optional(),
  day: z.string().min(1, { message: "Veuillez sélectionner un jour." }),
  h_begin: z.string().min(1, { message: "Veuillez entrer une heure de début." }),
  h_end: z.string().min(1, { message: "Veuillez entrer une heure de fin." }),
  reported_id: z.string().optional(),
  reported_observation: z.string().optional(),
  reported_status: z.string().optional(),
}).superRefine((data, ctx) => {
  if (new Date(`1970-01-01T${data.h_end}`) <= new Date(`1970-01-01T${data.h_begin}`)) {
    ctx.addIssue({
      path: ['h_end'],
      message: "L'heure de fin doit être supérieure à l'heure de début.",
      code: "custom",
    });
  }
});
  

export const NoteSchema = z.object({
  examType : z.string().min(1, { message: "Le type d'examen est requis." }),
  notes: z.record(
    z.object({
      note: z
        .number({
          required_error: "La note est requise",
          invalid_type_error: "La note doit être un nombre",
        })
        .min(0, { message: "La note doit être supérieure ou égale à 0" })
        .max(20, { message: "La note doit être inférieure ou égale à 20" }),
      observation: z
        .string()
        .optional()
    })
  ),
});