// src/models/userModel.ts
// Her definerer vi hvad en bruger ER i vores system
export interface UserInterface {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    isActive: boolean;
}