import {ModuleRef, Reflector} from "@nestjs/core";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {AppAbility, CaslAbilityFactory} from "../services/casl-ability.factory";
import {CHECK_POLICIES_KEY, Dictionary, PolicyHandler} from "../decorators/policies.decorator";

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
        private moduleRef: ModuleRef
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers =
            this.reflector.get<PolicyHandler[]>(
                CHECK_POLICIES_KEY,
                context.getHandler(),
            ) || [];

        const {user, body, params} = context.switchToHttp().getRequest();
        const ability = await this.caslAbilityFactory.createForUser(user);

        return await this.asyncEvery(policyHandlers, async (handler) =>
            await PoliciesGuard.execPolicyHandler(handler, ability, params.id, body, this.moduleRef),
        );
    }

    private static async execPolicyHandler(handler: PolicyHandler, ability: AppAbility, id: string, body: Dictionary<string>, moduleRef: ModuleRef) {
        if (typeof handler === 'function') {
            return handler(ability);
        }

        return await handler.handle(ability, id, body, moduleRef);
    }

    private asyncEvery = async (arr, predicate) => {
        for (let e of arr) {
            if (!await predicate(e)) return false;
        }
        return true;
    };
}