import {ParseIntPipe, Query} from "@nestjs/common";

export const IntQuery = (query): ParameterDecorator => (
    Query(query, new ParseIntPipe())
);