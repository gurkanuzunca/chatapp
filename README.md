# Chat App
Chat application build with NodeJs, ReactJs, Socket.io, Redis, Nginx, PM2.

## Features
- Defining a nickname
- Leaving the chat room.
- Information about the user who joined or left the chat.
- Realtime typing user info.
- Load-balancing with Nginx.
- Multiple instances.
## Installation
### Requirements
- Redis
- NodeJs
- Yarn
- PM2
- Nginx
### Server
- `cd project_folder`
- `cd backend`
- `yarn install`
- `pm2 start` If yo don't have PM2 in your system, install PM2 with `npm install pm2 -g`
- Copy nginx.conf from [nginx.conf](backend/nginx.conf) to `ngnix/conf/sites-enabled`
- Start Nginx
### Frontend
- `cd project_folder`
- `cd frontend`
- `yarn start` For the dev server.
- `yarn build`