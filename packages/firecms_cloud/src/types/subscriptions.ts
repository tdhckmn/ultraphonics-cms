import { Timestamp } from "@firebase/firestore";

export type Product = {
    id: string;
    active: boolean;
    description: string;
    name: string;
    tax_code: string;
    metadata: {
        type: SubscriptionType;
    };
};
export type ProductWithPrices = Product & {
    prices: ProductPrice[];
};

export type CurrencyOption = {
    custom_unit_amount: number | null;
    tax_behavior: string;
    unit_amount: number;
    unit_amount_decimal: string;
};

export type ProductPrice = {
    id: string;
    active: boolean;
    billing_scheme: string;
    currency: "eur" | "usd";
    description: string;
    interval: "month";
    interval_count: number;
    metadata: {
        product: string;
        type: "per_user" | "per_project";
    };
    currency_options: Record<"eur" | "usd", CurrencyOption>;
    tiers: ProductPriceTier[];
    default: boolean;
    tax_behavior: string;
    type: "recurring" | "one_time";
    unit_amount: number;
    recurring: {
        aggregate_usage: "max";
        interval: "month";
        interval_count: number;
        trial_period_days: number;
        usage_type: "metered";
    };
};

export type ProductPriceTier = {
    flat_amount: number | null;
    unit_amount: number;
    up_to: number;
    unit_amount_decimal: string;
    flat_amount_decimal: number | null;
};

export type SubscriptionType = "openai" | "cloud_plus" | "pro";

export type SubscriptionStatus =
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "trialing"
    | "unpaid";

export type Subscription = {
    id: string;
    price: ProductPrice;
    unit_amount: number;
    quantity: number;
    interval: string;
    interval_count: number;
    product: Product;
    stripeLink: string;
    status: SubscriptionStatus;
    metadata: {
        projectId?: string;
        licenseId?: string;
        type: SubscriptionType;
    };
    created: Timestamp;
    cancel_at_period_end: boolean;
    cancel_at: Timestamp;
    canceled_at: Timestamp;
    current_period_end?: Timestamp;
};
