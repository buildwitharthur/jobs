export type Status =
  | "applied"
  | "screening"
  | "interview"
  | "technical_test"
  | "offer"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "no_response";

export type StatusType = "active" | "closed";

export interface StatusDefinition {
  value: Status;
  label: string;
  type: StatusType;
}
