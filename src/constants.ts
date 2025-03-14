export enum PlanType {
  MVP = "MVP",
  CUSTOM = "custom",
}

export type Plan = {
  type: PlanType;
  price: string;
  interval: "month" | null;
  features: string[];
};

export const PRICES_MAP: Record<PlanType, Plan> = {
  [PlanType.MVP]: {
    type: PlanType.MVP,
    price: "$10,000",
    interval: null,
    features: ["feature 1", "feature 2", "feature 3"],
  },
  [PlanType.CUSTOM]: {
    type: PlanType.CUSTOM,
    price: "Starts at $8,000",
    interval: "month",
    features: ["feature 1", "feature 2", "feature 3"],
  },
};
