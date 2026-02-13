export type StepAction = {
  label: string;
  href: string;
};

export type Step = {
  id: string;
  title: string;
  description: string;
  points: string[];
  requiredRoutes: string[];
  actions: StepAction[];
};
