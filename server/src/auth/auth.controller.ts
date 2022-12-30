import {Body, Controller, Get, Post, Req, Res} from '@nestjs/common';
import {AuthService} from "./services/auth.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RegistrationDto} from "../user/dto/registration.dto";
import { Response, Request } from 'express';
import {LoginDto} from "../user/dto/login.dto";
import {ForgotPasswordDto} from "./dto/forgot-password.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Registration'})
    @ApiResponse({status: 200})
    @Post('/registration')
    async registration(@Body() dto: RegistrationDto,
                       @Res({passthrough: true}) response: Response) {
        const userData = await this.authService.registration(dto);
        response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        response.cookie('accessToken', userData.accessToken, {maxAge: 30 * 60 * 1000});
    }

    @ApiOperation({summary: 'Login'})
    @ApiResponse({status: 200})
    @Post('/login')
    async login(@Body() dto: LoginDto,
                @Res({passthrough: true}) response: Response) {
        const userData = await this.authService.login(dto);
        response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        response.cookie('accessToken', userData.accessToken, {maxAge: 30 * 60 * 1000});
    }

    @ApiOperation({summary: 'Logout'})
    @ApiResponse({status: 200})
    @Post('/logout')
    async logout(@Req() request: Request,
                 @Res({passthrough: true}) response: Response) {
        await this.authService.logout(request.cookies['refreshToken']);
        response.clearCookie('refreshToken');
        response.clearCookie('accessToken');
    }

    @ApiOperation({summary: 'Refresh'})
    @ApiResponse({status: 200})
    @Get('/refresh')
    async refresh(@Req() request: Request,
                  @Res({passthrough: true}) response: Response) {
        const userData = await this.authService.refresh(request.cookies['refreshToken']);
        response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        response.cookie('accessToken', userData.accessToken, {maxAge: 30 * 60 * 1000});
    }

    @ApiOperation({summary: 'Forgot password'})
    @ApiResponse({status: 200})
    @Post('/forgot')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        await this.authService.forgotPassword(dto);
    }
}
