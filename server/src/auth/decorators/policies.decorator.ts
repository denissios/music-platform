import {SetMetadata} from "@nestjs/common";
import {AppAbility} from "../services/casl-ability.factory";
import {ModuleRef} from "@nestjs/core";

export interface Dictionary<Type> {
    [key: string]: Type
}

export interface IPolicyHandler {
    handle(ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef): Promise<boolean>;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;
export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

export const CHECK_POLICIES_KEY = 'check_policy';

export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);