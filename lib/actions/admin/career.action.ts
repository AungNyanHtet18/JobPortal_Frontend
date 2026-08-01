'use server'

import { secureSearch } from "@/lib";
import { CareerListItem } from "@/lib/type/schema/admin/career.schema";

export async function getCareers() : Promise<CareerListItem[]> {
    const response = await secureSearch("admin/career")
    return await response.json() as CareerListItem[]
}