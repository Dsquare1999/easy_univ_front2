import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({
      message: "L'email est requis",
    }),
    password: z.string().min(8, {
      message: "Le mot de passe doit être d'au moins 8 caractères",
    }),
});

export const RegistrationSchema = z.object({
  name: z.string().min(3, {
    message: "Le nom complet doit être d'au moins 3 caractères",
  }),
  email: z.string().email({
    message: "L'email est requis",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe doit être d'au moins 8 caractères",
  }),
});

export const DetailSchema = z.object({
  name: z.string().min(1, { message: "Nom et Prénoms sont requis" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
  bio: z.string().optional(),
  profile: z.instanceof(File)
  .optional()
  .refine((file) => file ? file.size <= 2000000 : true, "La taille du fichier doit être inférieure à 2MB")
  .refine((file) => file ? file.type.includes("image") : true, "Le fichier doit être une image"),
});

export const CoverSchema = z.object({
  cover: z.instanceof(File)
  .refine((file) => !file || file.size <= 2000000, "La taille du fichier doit être inférieure à 2MB")
  .refine((file) => !file || file.type.includes("image"), "Le fichier doit être une image"),
});