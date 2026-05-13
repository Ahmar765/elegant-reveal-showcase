import { z } from "zod";

const optionalTrimmedString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .nullable()
    .transform((value) => (value && value.length > 0 ? value : null));

export const inquirySchema = z
  .object({
    source: z.enum(["consultation", "product", "configurator"]),
    name: z.string().trim().min(1, "Please share your full name.").max(120),
    email: z.string().trim().email("Please enter a valid email address.").max(200),
    message: z.string().trim().max(2000).default(""),
    context: optionalTrimmedString(300),
    productId: optionalTrimmedString(120),
    productName: optionalTrimmedString(200),
    configSummary: optionalTrimmedString(300),
    configSelection: z
      .object({
        colorId: z.string().trim().min(1).max(120),
        legId: z.string().trim().min(1).max(120),
        sizeId: z.string().trim().min(1).max(120),
      })
      .optional()
      .nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.source === "product" && !value.productId && !value.productName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productId"],
        message: "A product inquiry must include a product reference.",
      });
    }

    if (value.source === "configurator" && !value.configSummary) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["configSummary"],
        message: "A configurator inquiry must include the selected composition summary.",
      });
    }
  });

export type InquiryInput = z.infer<typeof inquirySchema>;
