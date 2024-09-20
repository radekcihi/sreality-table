import axios from 'axios';
import type { Estate, ApiResponse } from './types';
import { ApiResponseSchema } from './types';
import { z } from 'zod';

export async function fetchEstates(
  page = 1,
  perPage = 20,
  estateAge: number | null,
  category: number | null
): Promise<{ estates: Estate[]; totalPages: number }> {
  try {
    const response = await axios.get<ApiResponse>('https://www.sreality.cz/api/cs/v2/estates', {
      params: {
        page,
        per_page: perPage,
        estate_age: estateAge === 0 ? undefined : estateAge,
        category_main_cb: category === 0 ? undefined : category,
      },
    });

    const data = response.data;
    const validatedData = ApiResponseSchema.safeParse(data);

    if (!validatedData.success) {
      console.error('API response validation error:', validatedData.error.errors);
      throw new Error('Invalid API response structure');
    }

    return {
      estates: validatedData.data._embedded.estates,
      totalPages: Math.ceil(validatedData.data.result_size / data.per_page),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('API response validation error:', error.errors);
      throw new Error('Invalid API response structure');
    }
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      throw new Error(`Failed to fetch data: ${error.message} `);
    }
    console.error('Error fetching estates:', error);
    throw error;
  }
}

export async function getEstates(page: number, perPage: number, estateAge: number | null, category: number | null): Promise<{ estates: Estate[]; totalPages: number }> {
  const response = await axios.get<{ estates: Estate[]; totalPages: number }>('/api/estates', {
    params: {
      page,
      perPage,
      estateAge,
      category,
    },
  });

  return response.data;
}

export function renderType(type: number): string {
  switch (type) {
    case 1:
      return 'Sale';
    case 2:
      return 'Rent';
    default:
      return 'Unknown';
  }
}
export function renderCategory(category: number): string {
  switch (category) {
    case 1:
      return 'Apartment';
    case 2:
      return 'House';
    case 3:
      return 'Land';
    case 4:
      return 'Commercial';
    case 5:
      return 'Garage';
    default:
      return 'Unknown';
  }
}
