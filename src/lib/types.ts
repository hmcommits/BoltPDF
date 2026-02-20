export type ElementType = 'text' | 'image' | 'shape';

export interface PDFElement {
    id: string;
    type: ElementType;
    page: number;
    x: number;
    y: number;
    properties: Record<string, any>;
}

export interface Command {
    execute(): void;
    undo(): void;
}
