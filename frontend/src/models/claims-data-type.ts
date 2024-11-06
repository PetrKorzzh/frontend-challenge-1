export interface Claim {
  claim_id: number;
  subscriber_id: string;
  member_sequence: number;
  claim_status: string;
  billed: number;
  allowed: number;
  paid: number;
  payment_status_date: string;
  service_date: string;
  received_date: string;
  entry_date: string;
  processed_date: string;
  paid_date: string;
  payment_status: string;
  group_name: string;
  group_id: string;
  division_name: string;
  division_id: string;
  plan: string;
  plan_id: string;
  place_of_service: string;
  claim_type: string;
  procedure_code: string;
  member_gender: string;
  provider_id: number;
  provider_name: string;
}
