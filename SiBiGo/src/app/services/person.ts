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


  // Eliminar persona por ID
  async delete(id: number, token: string) {
    return await axios.delete(`http://localhost:3001/person/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async getPublicPersons() {
  const resp = await axios.get('http://localhost:3001/person/public');
  return resp.data || [];
}

}