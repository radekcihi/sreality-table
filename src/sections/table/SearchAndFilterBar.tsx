import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { searchParams } from '@/lib/searchParams';
import { FilterIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { Category } from './api/types';

export const categoryEnum = {
  0: 'All Categories',
  1: 'Apartments',
  2: 'Houses',
  3: 'Land',
  4: 'Commercial',
  5: 'Other',
} as const;

export default function SearchAndFilterBar() {
  const [category, setCategory] = useQueryState('category', searchParams.category);
  const [estateAge, setEstateAge] = useQueryState('estateAge', searchParams.estateAge);
  const [localEstateAge, setLocalEstateAge] = useState(estateAge ?? 0);

  return (
    <div className="mb-4 flex w-full items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Label>Category</Label>
              <Select
                value={category?.toString()}
                onValueChange={(value) => setCategory(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryEnum).map(([key, value]) => (
                    <SelectItem className="cursor-pointer" key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estate Age</Label>
              <Slider
                value={[localEstateAge]}
                onValueChange={(value) => setLocalEstateAge(value[0] ?? 0)}
                onValueCommit={(value) => setEstateAge(value[0] ?? 0)}
                max={30}
                step={1}
                className="cursor-pointer"
              />
              <div className="text-muted-foreground text-right text-sm">{localEstateAge} days</div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
