export interface IUser {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    isVerified: boolean;
    loginAttempts: number;     
    isLocked: boolean;         
    roles: "USER" | "ADMIN";
    otp?: string;
    otpExpiry?: number;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    experience: string;
    description: string;
}

export interface Application {
    userId: string;
    jobId: string;
    appliedAt: number;
}
