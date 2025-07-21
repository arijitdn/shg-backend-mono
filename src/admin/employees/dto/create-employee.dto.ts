export class CreateEmployeeDto {
  name: string;
  email: string;
  phone: string;
  designation: string;
  post: string;
  status?: string; // optional, defaults to 'active'
  joinDate?: Date;
}
