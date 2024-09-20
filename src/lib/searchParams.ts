import { parseCategory } from '@/sections/table/api/types';
import { createSearchParamsCache, createSerializer, parseAsInteger } from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withOptions({ shallow: false, clearOnDefault: true }).withDefault(1),
  perPage: parseAsInteger.withOptions({ shallow: false, clearOnDefault: true }).withDefault(10),

  category: parseCategory.withOptions({ shallow: false, clearOnDefault: true }),
  estateAge: parseAsInteger.withOptions({
    shallow: false,
    clearOnDefault: true,
    throttleMs: 1000,
  }),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
