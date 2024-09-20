import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Estate, EstateWithoutHashId } from '@/sections/table/api/types';
import { getEstates } from '@/sections/table/api/utils';

export function useLocalEstate({
    initialData,
    page = 1,
    perPage = 20,
    estateAge,
    category
}: {
    initialData: {
        estates: Estate[];
        totalPages: number;
    },
    page: number,
    perPage: number,
    estateAge: number | null,
    category: number | null
}) {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['estates', estateAge, category, page, perPage],
        queryFn: () => getEstates(page, perPage, estateAge, category),
        initialData: initialData,
    });

    const addEstate = useMutation({
        mutationFn: (newEstate: EstateWithoutHashId) => {
            const tempId = Date.now();
            return Promise.resolve({ ...newEstate, hash_id: tempId });
        },
        onSuccess: (newEstate) => {
            queryClient.setQueryData(['estates', estateAge, category, page, perPage], (oldData: typeof initialData): typeof initialData => ({
                ...oldData,
                estates: [newEstate, ...oldData.estates],
                totalPages: Math.ceil((oldData.estates.length + 1) / perPage)
            }));
        },
    });

    const updateEstate = useMutation({
        mutationFn: (updatedEstate: Estate) => Promise.resolve(updatedEstate),
        onSuccess: (updatedEstate) => {
            queryClient.setQueryData(['estates', estateAge, category, page, perPage], (oldData: typeof initialData): typeof initialData => ({
                ...oldData,
                estates: oldData.estates.map(estate => estate.hash_id === updatedEstate.hash_id ? updatedEstate : estate)
            }));
        },
    });

    const deleteEstate = useMutation({
        mutationFn: (estateId: number) => Promise.resolve(estateId),
        onSuccess: (estateId) => {
            queryClient.setQueryData(['estates', estateAge, category, page, perPage], (oldData: typeof initialData): typeof initialData => ({
                ...oldData,
                estates: oldData.estates.filter(estate => estate.hash_id !== estateId),
                totalPages: Math.ceil((oldData.estates.length - 1) / perPage)
            }));
        },
    });

    return {
        estates: data?.estates || [],
        totalPages: data?.totalPages || 0,
        addEstate,
        updateEstate,
        deleteEstate,
        isLoading,
        isError,
        error,
    };
}