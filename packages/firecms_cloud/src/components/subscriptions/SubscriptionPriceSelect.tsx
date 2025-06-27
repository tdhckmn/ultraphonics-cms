import React from "react";
import { getPriceString, ProductPrice } from "../../index";
import { Chip, Select, SelectItem } from "@firecms/ui";

export interface SubscriptionPriceSelectParams {
    productPrices: ProductPrice[] | undefined;
    selectedPrice?: ProductPrice;
    setSelectedPrice: (price?: ProductPrice) => void;
    largePriceLabel: boolean;
    fullWidth?: boolean;
}

export function SubscriptionPriceSelect({
    productPrices,
    setSelectedPrice,
    largePriceLabel,
    selectedPrice,
    fullWidth = true,
}: SubscriptionPriceSelectParams) {
    return (productPrices ?? [])?.length > 1 ? (
        <>
            <Select
                size={"medium"}
                invisible={true}
                padding={false}
                fullWidth={false}
                onChange={(e) => {
                    setSelectedPrice(
                        (productPrices ?? []).find((price) => price.id === e.target.value)
                    );
                }}
                className={fullWidth ? "w-full" : "w-fit"}
                position={"item-aligned"}
                // label={"Choose pricing plan"}
                renderValue={(value) => {
                    const price = (productPrices ?? []).find((price) => price.id === value);
                    if (!price) return null;
                    if (largePriceLabel) {
                        return (
                            <span
                                className={
                                    "ml-4 mb-4 text-2xl font-bold text-primary text-center my-8"
                                }
                            >
                                {getPriceString(price)}
                            </span>
                        );
                    }
                    return <Chip>{price ? getPriceString(price) : ""}</Chip>;
                }}
                value={selectedPrice?.id ?? ""}
            >
                {productPrices &&
                    productPrices.map((price) => (
                        <SelectItem key={price.id} value={price.id}>
                            {getPriceString(price)}
                        </SelectItem>
                    ))}
            </Select>
        </>
    ) : productPrices ? (
        largePriceLabel ? (
            <span className={"ml-4 mb-4 text-2xl font-bold text-primary text-center my-8"}>
                {getPriceString(productPrices[0])}
            </span>
        ) : (
            <Chip size={"medium"}>{getPriceString(productPrices[0])}</Chip>
        )
    ) : null;
}
