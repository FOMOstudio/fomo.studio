export enum PlanType {
  MVP = "MVP",
  CUSTOM = "custom",
}

export type Plan = {
  type: PlanType;
  price: string;
  interval: "monthly" | null;
  features: string[];
  title: string;
  description: string;
  paymentUrl: string;
};

export const PRICES_MAP: Record<PlanType, Plan> = {
  [PlanType.MVP]: {
    type: PlanType.MVP,
    price: "$10,000 One-time",
    interval: null,
    title: "MVP",
    description:
      "Perfect for those who want to get their product out there quickly.",
    features: ["Code & Design", "Deployed and ready to go", "Feature-complete"],
    paymentUrl: "https://stripe.com/checkout/12",
  },
  [PlanType.CUSTOM]: {
    type: PlanType.CUSTOM,
    price: "Starts at $8,000/month",
    interval: "monthly",
    title: "Product",
    description: "Perfect for those with ongoing needs and need for growth.",
    features: ["Pause anytime", "No lock-in", "No commitment"],
    paymentUrl: "https://stripe.com/checkout/13",
  },
};
