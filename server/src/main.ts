import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "./common/pipes/validation.pipe";
import * as cookieParser from 'cookie-parser';

const start = async () => {
    const PORT = process.env.BACKEND_PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        credentials: true,
        origin: true
    });
    app.use(cookieParser());
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('Music platform')
        .setVersion('1.0.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .setDescription('Documentation')
        .addTag('Music')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.useGlobalPipes(new ValidationPipe);
    await app.listen(PORT, () => console.log(`Work on port ${PORT}`))
}
start();