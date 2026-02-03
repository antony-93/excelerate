# Excelerate

Excelerate is a package designed to make developing with Ext JS Classic easier. With a single command, it allows you to run your Ext JS application with hot reload and live reload support, significantly improving your productivity.

### Key Features

* **Hot Reload**: Changes to the code are instantly reflected in the application without the need to reload the page.

* **Live Reload**: When detecting changes in your code, the page will automatically reload.

* **Ease of Use**: With just one command, quickly launch your development environment and focus on coding.

## Installation

To install excelerate, run the following command in your console

```bash
npm i -g excelerate
```

## Commands

The excelerate package offers the following commands:

`excelerate`

This command starts the application, by default it uses hot reload!

### Arguments:

* `--port`

  * **Description**: Defines the port on which the application will run.

  * **Use**: To specify the port, add --port followed by the desired port number.

  * **Example**:

    ```bash
    excelerate --port 3000
    ```

* `--live`

  * **Description**: Activates live reload, allowing code changes to be automatically reflected in the browser.

  * **Use**: To enable this option, add --live to the command.

  * **Example**:

    ```bash
    excelerate --live
    ```

### Complete example:
To run the application with hot reload and on port 3000, you would use the following command:

```bash
excelerate --port 3000
```

If you want only live reload, add --live to the command

```bash
excelerate --live --port 3000
```
## Configurations

You can customize **Excelerate** by creating an `excelerate.config.js` file in the root of your project. This allows you to define persistent settings for your workflow without typing arguments every time.

### Example `excelerate.config.js`

```javascript
module.exports = {
    watcher: {
        // Files that trigger Hot Reloading (instant update)
        include: ['app/**/*.js', 'packages/local/**/*.js'],
        
        // Files and directories to be ignored by the watcher
        exclude: ['**/node_modules/**', 'build/**', 'packages/local/**/build/**'],
        
        // Files that trigger a full browser reload (Live Reload)
        live: ['index.html']
    },
    server: { 
        // Default port for the development server
        port: 3000 
    }
};
```

### Default Values

If the `excelerate.config.js` file is not present, the CLI will automatically use the following default settings:

```javascript
{
    watcher: {
        include: ['app/**/*.js', 'packages/local/**/*.js'],
        exclude: ['**/node_modules/**', 'build/**', 'packages/local/**/build/**'],
        live: ['index.html']
    },
    server: { 
        port: 3000 
    }
}
```