import { JwtPayload } from 'jsonwebtoken';
export interface Payload extends JwtPayload {
    id: number;
    email: string;
    exp: number;
}
