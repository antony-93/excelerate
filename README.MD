# excelerate

excelerate is a package designed to make developing with Ext JS Classic easier. With a single command, it allows you to run your Ext JS application with hot reload and live reload support, significantly improving your productivity.

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
    excelerate --live
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

If you want only live, add --live to the command

```bash
excelerate --live --port 3000
```