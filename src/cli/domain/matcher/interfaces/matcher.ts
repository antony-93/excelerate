export interface IMatcher {
    isMatch(path: string, patterns?: string[], ignore?: string[]): boolean;
}