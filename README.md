# Music-Platform

> Не коммитить .env!

##Запуск BACKEND:
1. В `.env` прописать `JWT_ACCESS_SECRET` и `JWT_REFRESH_SECRET` (любые секретные строки)
2. Для работы подтверждения почты в `.env` прописать `MAIL_TRANSPORT` в виде `smtps://username:password@smtp.example.com`, также указать `SMTP_USER` как `username` из примера
3. `make run-dev`
4. Чтобы остановить: `docker compose down`

##Запуск FRONTEND:
1. `npm i`
2. `npm start`

- Author - Tokaev Denis
