# Shop Flow

## How to start
* Create your own `.env` file from the template
* Install dependencies with
    ```bash
    npm install
    ```

### Development
```bash
npm run start
```

### Production
Install serve if you haven't already.
```bash
npm install -g serve
```
```bash
npm run build && serve -s build
```

## Usage
Service worker only works in build. In production only run via a secure connection.