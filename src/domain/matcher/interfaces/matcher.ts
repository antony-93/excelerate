export interface IMatcher {
    isMatch(filepath: string, patterns?: string[], ignore?: string[]): boolean;
}