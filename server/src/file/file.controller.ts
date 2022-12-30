import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, Post, Res, UseGuards} from "@nestjs/common";
import {FileService} from "./file.service";
import {Roles} from "../auth/decorators/roles-auth.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {IntParam} from "../common/decorators/intParam.decorator";
import {Response} from "express";
import * as path from 'path';

@ApiTags('file')
@Controller('file')
export class FileController {
    constructor(private fileService: FileService) {}

    @ApiOperation({summary: 'Получить картинку'})
    @ApiResponse({status: 200, type: String})
    @ApiBearerAuth('JWT-auth')
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get('/image/:name/:size')
    async getImage(@IntParam('size') size: number,
                   @Param('name') name: string,
                   @Res() response: Response) {
        await this.fileService.checkImage(name);
        return response.sendFile(name, {root: path.resolve(__dirname, '..', 'static', 'image')});
    }
}