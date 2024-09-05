export class UserModel {
    id?: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    isAdmin: boolean;
    token?: string;
  
    constructor(obj: UserModel) {
        this.id = obj.id;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.password = obj.password;
        this.email = obj.email;
        this.isAdmin = obj.isAdmin;
        this.token = obj.token;
    }
  }


