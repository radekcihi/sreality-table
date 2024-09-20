'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { CategoryEnum, type Estate, type EstateWithoutHashId } from './api/types';

const enumType = {
  1: 'Sale',
  2: 'Rent',
} as const;

const enumCategory = {
  1: 'Apartment',
  2: 'House',
  3: 'Land',
  4: 'Commercial',
  5: 'Garage',
} as const;

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  locality: z.string().min(1, 'Locality is required'),
  price: z.coerce.number().min(1, 'Price must be a positive number'),
  type: z.number().min(1).max(2),
  category: CategoryEnum,
  labels: z.array(z.string()).default([]),
  gps: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  _links: z.object({
    images: z.array(z.object({ href: z.string() })),
  }),
  new: z.boolean(),
});

export default function PropertyForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (item: EstateWithoutHashId) => void;
  initialData?: Estate;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
      name: '',
      locality: '',
      price: 0,
      type: 1,
      category: 1,
      labels: [],
      gps: { lat: 0, lon: 0 },
      _links: { images: [] },
      new: false,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locality</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(enumType).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(enumCategory).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labels (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.split(','))}
                  value={field.value.join(',')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{initialData ? 'Update' : 'Add'} Property</Button>
      </form>
    </Form>
  );
}
