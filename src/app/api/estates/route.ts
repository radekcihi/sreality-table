import { NextResponse } from "next/server";
import { fetchEstates } from "@/sections/table/api/utils";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') ?? '1';
    const perPage = searchParams.get('perPage') ?? '20';
    const estateAge = searchParams.get('estateAge') ?? null;
    const category = searchParams.get('category') ?? null;

    const { estates, totalPages } = await fetchEstates(
        Number(page),
        Number(perPage),
        estateAge ? Number(estateAge) : null,
        category ? Number(category) : null
    );
    return NextResponse.json({ estates, totalPages });
}
