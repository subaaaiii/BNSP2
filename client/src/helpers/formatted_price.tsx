export const formattedPrice = (price : any) => {
    return new Intl.NumberFormat("id-ID").format(Number(price));
} 