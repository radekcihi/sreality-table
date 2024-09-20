import { createParser } from 'nuqs';
import { z } from 'zod';

export const EstateSchema = z.object({
    hash_id: z.number(),
    name: z.string(),
    locality: z.string(),
    price: z.number(),
    type: z.number(),
    category: z.number(),
    labels: z.array(z.string()),
    gps: z.object({
        lat: z.number(),
        lon: z.number(),
    }),
    _links: z.object({
        images: z.array(z.object({ href: z.string() })),
    }),
    new: z.boolean(),
});

export const ApiResponseSchema = z.object({
    _embedded: z.object({
        estates: z.array(EstateSchema),
    }),
    result_size: z.number(),
    page: z.number(),
    per_page: z.number(),
});

export type Estate = z.infer<typeof EstateSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

export const EstateAgeEnum = z.number().positive().nullable();
export type EstateAge = z.infer<typeof EstateAgeEnum>;

enum NativeCategoryEnum {
    APARTMENT = 1,
    HOUSE = 2,
    LAND = 3,
    COMMERCIAL = 4,
    OTHER = 5,
}

export const CategoryEnum = z.nativeEnum(NativeCategoryEnum);
export type Category = z.infer<typeof CategoryEnum>;

export const parseCategory = createParser({
    parse: (value) => CategoryEnum.parse(Number(value)),
    serialize: (value) => value?.toString() ?? undefined,
});
