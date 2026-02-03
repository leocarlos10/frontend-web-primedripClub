export type ErrorResponse = {
    timestamp: string;
    status: number;
    success: boolean;
    error: string;
    message: string;
    path: string;
}