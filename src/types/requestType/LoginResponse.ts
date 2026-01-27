export interface LoginResponse {
    nombre: string;
    email: string;
    roles: string[];
    token: string;
    tokenType: string;
}