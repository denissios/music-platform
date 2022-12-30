import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendActivation(to: string, link: string) {
        await this.mailerService.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Активация аккаунта на ${process.env.CLIENT_URL}`,
            text: '',
            html:  `<div>
                        <h2>Для активации аккаунта перейдите по ссылке</h2>
                        <a href="${link}">${link}</a>        
                    </div>`
        })
    }

    async sendPassword(to: string, link: string) {
        await this.mailerService.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Восстановление пароля на ${process.env.CLIENT_URL}`,
            text: '',
            html:  `<div>
                        <h2>Для восстановления пароля перейдите по ссылке</h2>
                        <a href="${link}">${link}</a>        
                    </div>`
        })
    }
}