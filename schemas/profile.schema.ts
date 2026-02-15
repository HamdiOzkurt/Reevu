import { z } from "zod";

export const ProfileFormSchema = z.object({
  firstName: z
    .string({ error: "Ad alanı zorunludur." })
    .min(2, "Ad en az 2 karakter olmalıdır.")
    .max(50, "Ad en fazla 50 karakter olabilir."),
  lastName: z
    .string({ error: "Soyad alanı zorunludur." })
    .min(2, "Soyad en az 2 karakter olmalıdır.")
    .max(50, "Soyad en fazla 50 karakter olabilir."),
  email: z
    .string({ error: "E-posta adresi zorunludur." })
    .email("Geçerli bir e-posta adresi giriniz."),
});

export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
