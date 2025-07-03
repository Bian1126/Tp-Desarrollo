import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class AuthService {
  async login(email: string, password: string) {
    const response = await axios.post('http://localhost:3000/login', {
      email,
      password
    });
    return response.data;
  }
}
