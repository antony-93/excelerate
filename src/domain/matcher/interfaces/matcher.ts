export interface IMatcher {
    isMatch(filepath: string, patterns: string[]): boolean;
}