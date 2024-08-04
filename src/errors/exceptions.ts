export class HttpException extends Error {

    error: any;
    statusCode: number;

    constructor(message: string, error: any, statusCode: number) {
        super(message);
        this.error = error;
        this.statusCode = statusCode;
    };
}

export class BadRequestException extends HttpException {
    constructor(message: string, error: any) {
        super(message, error, 400);
    };
}

export class NotFoundException extends HttpException {
    constructor(message: string, error: any) {
        super(message, error, 404);
    };
}

export class UnauthorizedException extends HttpException {
    constructor(message: string, error: any) {
        super(message, error, 401);
    };
}

export class InternalException extends HttpException {
    constructor(error: any) {
        super('Internal Exception', error, 500);
    };
}

export class ConflictException extends HttpException {
    constructor(message: string, error: any) {
        super(message, error, 409);
    };
}