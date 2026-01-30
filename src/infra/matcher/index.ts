import { IMatcher } from '@domain/matcher/interfaces/matcher';
import picomatch from 'picomatch';

export class PicomatchMatcher implements IMatcher {
    constructor(private readonly workingDir: string) {}

    isMatch(path: string, patterns: string[] = [], ignore: string[] = []): boolean {
        const normalizedPath = path.replace(/\\/g, '/');
        const normalizedBase = this.workingDir.replace(/\\/g, '/');

        let relativePath = normalizedPath.replace(normalizedBase, '');

        if (relativePath.startsWith('/')) relativePath = relativePath.substring(1);

        const isMatch = picomatch(patterns, {
            ignore: ignore
        });

        return isMatch(relativePath);
    }
}