import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {ROLES_KEY} from "../decorators/roles-auth.decorator";
import {TokenService} from "../services/token.service";
import {BanUserService} from "../../user/services/ban-user.service";
import {UserService} from "../../user/services/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
                private tokenService: TokenService,
                private banUserService: BanUserService,
                private userService: UserService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ]);
            if(!requiredRoles) {
                return true;
            }

            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;

            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if(!bearer || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'});
            }

            const userData = this.tokenService.validateAccessToken(token);

            return this.userService.getUser(userData.id)
                .then(user => {
                    if(!user) {
                        throw new UnauthorizedException({message: 'Пользователь не авторизован'});
                    }

                    return this.banUserService.checkBan(user._id)
                        .then(() => {
                            req.user = user;
                            return user.roles.some(r => requiredRoles.includes(r.name))
                        })
                }, () => false);
        } catch (e) {
            throw new HttpException('Пользователь не авторизован!', HttpStatus.UNAUTHORIZED);
        }
    }
}