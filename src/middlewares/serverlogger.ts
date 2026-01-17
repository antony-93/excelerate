import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

export default function serverlogger(req: Request, res: Response, next: NextFunction) {    
    const currentDate = new Date(),
        formattedDate = `${chalk.white(currentDate.toLocaleDateString())} ${chalk.white(currentDate.toLocaleTimeString())}`,
        protocol = req.protocol === 'https' ? chalk.bgMagenta.bold(' HTTPS ') : chalk.bgBlue.bold(' HTTP '),
        startTime = process.hrtime();

    console.log(
        `${protocol} ${formattedDate} ${chalk.yellow(req.ip)} ${chalk.cyan(req.method)} ${chalk.cyan(req.url)}`
    );

    res.on('finish', () => {
        const diff = process.hrtime(startTime),
            responseTime = `${Math.round((diff[0] * 1000) + (diff[1] / 1000000))} ms`;

        let statusColor;

        if (res.statusCode >= 500) {
            statusColor = chalk.red;
        } else if (res.statusCode >= 400) {
            statusColor = chalk.red;
        } else if (res.statusCode >= 300) {
            statusColor = chalk.green;
        } else {
            statusColor = chalk.green;
        }

        console.log(
            `${protocol} ${formattedDate} ${chalk.yellow('::1')} ${statusColor(`Returned ${res.statusCode} ${responseTime}`)}`
        );
    });

    next();
}