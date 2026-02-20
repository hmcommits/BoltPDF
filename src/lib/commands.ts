import { PDFElement, Command } from './types';
import { usePDFStore } from '@/store/usePDFStore';

export class AddElementCommand implements Command {
    constructor(private element: PDFElement) { }

    execute() {
        usePDFStore.getState().addElement(this.element);
    }

    undo() {
        usePDFStore.getState().removeElement(this.element.id);
    }
}

export class MoveElementCommand implements Command {
    constructor(
        private id: string,
        private oldX: number,
        private oldY: number,
        private newX: number,
        private newY: number
    ) { }

    execute() {
        usePDFStore.getState().updateElement(this.id, { x: this.newX, y: this.newY });
    }

    undo() {
        usePDFStore.getState().updateElement(this.id, { x: this.oldX, y: this.oldY });
    }
}

export class UpdateElementPropertyCommand implements Command {
    constructor(
        private id: string,
        private oldProps: any,
        private newProps: any
    ) { }

    execute() {
        usePDFStore.getState().updateElement(this.id, { properties: this.newProps });
    }

    undo() {
        usePDFStore.getState().updateElement(this.id, { properties: this.oldProps });
    }
}
