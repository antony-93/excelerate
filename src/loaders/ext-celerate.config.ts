import fs from 'fs';
import path from 'path';

export default function () {
    const configPath = path.resolve(process.cwd(), 'ext-celerate.config.json');

    if (!fs.existsSync(configPath)) {
        console.error('Erro: O arquivo ext-celerate.config.json não foi encontrado.');
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8')),
        firstObject = Array.isArray(config) ? config[0] : config,
        paths = firstObject?.paths;

    if (!Array.isArray(paths)) {
        console.log('paths não foi definido corretamente!');
        process.exit(1);
    }

    if (!paths.length) {
        console.log('Informe pelo mesmo um caminho');
        process.exit(1);
    }

    return { paths };
}