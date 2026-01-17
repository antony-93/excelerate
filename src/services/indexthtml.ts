import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

class indexhtmlservice {
    async formatarIndexHtml(): Promise<string> {
        const indexPath = path.join(process.cwd(), 'index.html'),
            readFileAsync = promisify(fs.readFile);

        try {
            const data = await readFileAsync(indexPath, 'utf8'),
                script = '<script type="text/javascript" charset="UTF-8" src="http://localhost:3000/reload.js"></script>';
    
            return data.replace('</body>', `${script}</body>`);;
        } catch (err) {
            throw new Error('Error reading file');
        }
    }
}

export default new indexhtmlservice()