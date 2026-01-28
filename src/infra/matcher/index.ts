import { IMatcher } from '@domain/matcher/interfaces/matcher';
import picomatch from 'picomatch';

export class PicomatchMatcher implements IMatcher {
    isMatch(filepath: string, patterns: string[] = [], ignore: string[] = []): boolean {
        const isMatch = picomatch(patterns, {
            ignore: ignore
        });

        return isMatch(filepath);
    }
}