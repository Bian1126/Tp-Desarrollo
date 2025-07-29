import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class Person {
  async agregarPersona(payload: any, token: string) {
    return await axios.post('http://localhost:3001/person', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async registerPublic(payload: any) {
    return await axios.post('http://localhost:3001/person/public', payload);
  }

  async getPerson(id: string, token: string) {
    const resp = await axios.get(
      `http://localhost:3001/person/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return resp.data;
  }

  async updatePerson(id: string, data: any, token: string) {
    return await axios.patch(
      `http://localhost:3001/person/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // Obtener todas las personas
  async getAll(token: string) {
    const response = await axios.get('http://localhost:3001/person', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.items || [];
  }

  async getAllSinPaginar(token: string) {
    const response = await axios.get('http://localhost:3001/person/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || [];
  }

  async delete(id: number, token: string, email: string) {
    // Eliminar en tp-persona
    await axios.delete(`http://localhost:3001/person/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Eliminar en tp-JWT
    await axios.delete(`http://localhost:3000/user/${email}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async getPublicPersons() {
    const resp = await axios.get('http://localhost:3001/person/public');
    return resp.data || [];
  }
  
  async updateUserJWT(oldEmail: string, data: any, token: string) {
    return await axios.patch(`http://localhost:3000/user/${oldEmail}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
  
  async registerUserJWT(email: string, password: string, token: string) {
    return await axios.post('http://localhost:3000/register', {
      email,
      password
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

}