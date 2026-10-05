import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { env } from '../../environments/environment';
import { LoginResponse } from '../../models/login-response';
import { RegisterResponse } from '../../models/register-response';
import { UserList } from '../../models/user-list';
import { CreateUser } from '../../models/create-user';
import { UpdateUser } from '../../models/update-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(usr: string, pwd: string) {
    return this.http.post<LoginResponse>(env.apiUrl + '/User/Login', {
      usr: usr,
      pwd: pwd,
    });
  }

  register(usr: string, pwd: string, name: string) {
    return this.http.post<RegisterResponse>(env.apiUrl + '/User/Register', {
      usr: usr,
      pwd: pwd,
      name: name,
    });
  }
  UserList() {
    return this.http.get<UserList[]>(env.apiUrl + '/User/ListUser');
  }
  createUser(createUser: CreateUser) {
    return this.http.post(env.apiUrl + '/User/CreateUser', createUser);
  }
  getUser(id: number) {
    return this.http.get<UserList>(env.apiUrl + '/User/GetUser/' + id);
  }

  updateUser(id: number, user: UpdateUser) {
    return this.http.put(env.apiUrl + '/User/UpdateUser/' + id, user);
  }
  deleteUser(id: number) {
    return this.http.delete(env.apiUrl + '/User/DeleteUser/' + id);
  }
}
