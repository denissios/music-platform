import {Param} from "@nestjs/common";
import {ObjectIdPipe} from "../pipes/objectId.pipe";

export const IdParam = (param = '_id'): ParameterDecorator => (
    Param(param, new ObjectIdPipe())
);