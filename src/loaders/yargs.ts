import yargs from 'yargs';

export default async function () {
    const args = await yargs.command('run', 'Executa o pacote Texugo', (yargs) => {
        yargs.option('port', {
            alias: 'p',
            description: 'Port to use',
            type: 'number',
            default: 3000
        })

        yargs.option('browser-reload', {
            description: 'When detecting changes, it loads the browser pages opened with its server',
            type: 'boolean',
            default: false
        })

        yargs.option('log', {
            description: 'Prints requests made to the console',
            type: 'boolean',
            default: false
        })
    })
    .parse(process.argv.slice(2));

    if (!args._.includes('run')) {
        console.log('Commands: run')
        process.exit(1);
    }

    return { args }
}