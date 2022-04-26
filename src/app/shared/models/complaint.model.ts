export class Complaint {
  _id! : string;
  student_id! : string;
  student_name! : string;
  complaint_header! : string;
  complaint_body! : string;
  complaint_status! : number;
  moderated_by! : string | undefined;
  resolution_id! : string;
  FAQ! : number;
  createdAt! : string;
  updatedAt! : string;
}
