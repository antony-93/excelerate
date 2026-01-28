import { IMatcher } from '@domain/matcher/interfaces/matcher';
import picomatch from 'picomatch';

export class PicomatchAdapter implements IMatcher {
    isMatch(filepath: string, patterns: string[]): boolean {
        const isMatch = picomatch(patterns);
        return isMatch(filepath);
    }
}