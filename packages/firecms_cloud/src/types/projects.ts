export type ProjectSubscriptionPlan = "free" | "cloud_plus" | "pro";

export type ProjectSubscriptionData = {
    subscription_plan: ProjectSubscriptionPlan;
    subscription_status: string;
};

export type FireCMSProject = {
    name: string;
    projectId: string;
    subscription_plan: ProjectSubscriptionPlan;
    subscription_data: ProjectSubscriptionData;
    trial_valid_until: Date;
};
