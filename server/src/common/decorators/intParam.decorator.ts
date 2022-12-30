import {Param, ParseIntPipe} from "@nestjs/common";

export const IntParam = (param): ParameterDecorator => (
    Param(param, new ParseIntPipe())
);