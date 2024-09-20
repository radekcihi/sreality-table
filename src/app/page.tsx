import { fetchEstates } from '@/sections/table/api/utils';
import RealEstateTable from '@/sections/table/Estate';
import { Suspense } from 'react';
import { type SearchParams } from 'nuqs/parsers';
import { searchParamsCache } from '@/lib/searchParams';

interface PageProps {
  searchParams: SearchParams;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { page, perPage, estateAge, category } = searchParamsCache.parse(searchParams);

  const initialData = await fetchEstates(page, perPage, estateAge, category);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b text-black">
      <div className="container flex flex-col items-center justify-center px-4 py-16">
        <h1 className="mb-4 text-2xl font-bold">Estate listings</h1>
        <Suspense
          key={`${page}-${perPage}-${estateAge ?? ''}-${category ?? ''}`}
          fallback={<div>Loading...</div>}
        >
          <RealEstateTable initialData={initialData} />
        </Suspense>
      </div>
    </main>
  );
}
