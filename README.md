


### Run in Debug Mode
DEBUG=scannerApp:* npm run devstart

### Build Docker Container
docker build -t local/scanner-app . 

### Run Docker Container
docker run -p 3000:3000 local/scanner-app