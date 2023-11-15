# Application Server
## Basic Information
The application server in use is the default provided by Next.js and is simple to get started locally.
_pnpm_ is what is in use for the current project simply due to its more considerate use of disk space (compared to _npm_).

## Local Development
### Cloning the project
```bash
git clone https://github.com/nja93/vervet.git
```

### Local Installation
On the clean repo clone, in the root folder:
```bash
pnpm install
```
to install the dependencies enumerated in *package.json*.

### Running the Servers
### Introduction
To run either of these servers, you'll need an enviroment variable file (*.env*) to define the values needed to ensure smooth running of the project.
```ini
DATABASE_URL='Database url pointing to a running Postgres instance with the default public schema'

GOOGLE_CLIENT_ID='See Google Console Cloud' ; For Google OAuth
GOOGLE_CLIENT_SECRET='See Google Console Cloud' ; For Google OAuth


NEXTAUTH_SECRET='See next-auth' ; use openssl to generate a 32-bit key. For JWT tokens
NEXTAUTH_URL='https://localhost:3000' ; http if using dev:http, different in deployemnt (5-deployment)
NEXT_PUBLIC_API_PATH="api/v1" ; shorthand helper pointing to the api routes

NEXT_PUBLIC_VAPID_SUBJECT='mailto: youremail@email.com'
NEXT_PUBLIC_VAPID_KEY='See web-push or below'
PRIVATE_VAPID_KEY='See web-push or below'

```
* You can use `pnpm run web-push generate-vapid-keys` to generate a key pair of _VAPID_ keys (for _NEXT_PUBLIC_VAPID_KEY_ and _PRIVATE_VAPID_KEY_)
* Environment variables starting with _NEXT_PUBLIC__ are **EXPOSED** to the client side so be careful not to define your secrets in such.

#### Development Server
To run the development server:
```bash
pnpm run dev:http
```
which will allow for facilites such as hot-reloading.

What is with the _dev:http_? That is the script that allows for a typical localhost server. But the application makes use of OAuth in its authentication cycle, and to make use of that in a local environment would require some fashion of self-signed TLS certificates. Good news! Next.js 13+ has a feature just for that!

A script is added for convinience and you guessed it:
```bash
pnpm run dev:https
```
to start the https script. This uses the command `next dev --experimental-https` (experimental at the time of writing -- Next.js v13.5.6) to generate self-signed certificates. You may need to allow this on some systems (looking at you Windows) with a confirmation dialog.

#### Production Server
To run a production server, you'll first need to run  `pnpm run build` to create the build files followed by 
`pnpm run start` to run the server from the build files. For convinience you can run `pnpm run prod` to run both of those steps in succession.

### House-keeping
#### Linting
Run `pnpm run lint` to check on the code's adhearance to the standards decided on the project. The configuration for this is defined in *.eslintrc.json*