import {Param, ParseUUIDPipe} from "@nestjs/common";

export const UUIDParam = (param = '_id'): ParameterDecorator => (
    Param(param, new ParseUUIDPipe())
);