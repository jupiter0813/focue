import { getPrices } from "./get-prices";

export type GetPriceByIdParams = {
    id: number;
};

export async function getPriceById(params: GetPriceByIdParams) {
    const prices = await getPrices();
    return prices.find((price) => price.id === params.id);
}
