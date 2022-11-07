import {HttpException, HttpStatus} from "@nestjs/common";

export class ValidateException extends HttpException {
    message

    constructor(response) {
        super(response, HttpStatus.BAD_REQUEST);
        this.message = response;
    }
}