import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class City {
  async getCiudadesCordoba(): Promise<any[]> {
    const resp = await axios.get('http://localhost:3001/city');
    return (resp.data.items || []).filter(
      (c: any) => c.province?.name === 'Córdoba'
    );
  }

  async getCiudadesCordobaPublic(): Promise<any[]> {
    const resp = await axios.get('http://localhost:3001/city/public');
    return (resp.data.items || []).filter(
      (c: any) => c.province?.name === 'Córdoba'
    );
  }
}