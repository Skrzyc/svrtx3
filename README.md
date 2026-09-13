# svrtx3

Static modern pre-configured web template with vite

svrtx3 -> svrttt -> (Static Vite React Typescript Tailwind Template)

---

**tech stack** : `vite`, `react`, `typescript`, `tailwind`,

---

This template setup features:

**repo setup**

- prettier and linter setup
- unit test setup
- tailwind setup
- router setup
- custom logger

**included files**

- og image

- .htaccess file (for apache type servers) with index.html revalidation & serving pages directly
- sitemap.xml
- robots.txt

- apple icon & favicon

- static fonts
- google fonts

- placeholder image

- CHANGELOG.MD - (should include changes between app versions)

**pages**

- home
- 404 (not found)
- privacy-policy

**tools**

- post build script - (running after the build)
- deployment script - via ftp (see SETUP FOR DEPLOYMENT)
- playground.js/ts - (for testing/running small chunks of code)

## SETUP

- `npm install`

## SETUP FOR DEPLOYMENT

- create .env file with `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_REMOTE_DIR`
- make sure u add `python` as global variable
- make sure ur build folder is `/dist`
