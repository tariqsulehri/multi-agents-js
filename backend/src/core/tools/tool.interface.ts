export interface Tool {
    name: string;
    execute(input: any): Promise<any>;
}