export class ApiError extends Error {
    status: number
    error: any

    constructor(message: string, status: number, error: any) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.error = error
    }
}
