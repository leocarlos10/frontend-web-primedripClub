export type Response<T> = {
    responseCode: number;
    success: boolean;
    data: T;
    message: string;
}