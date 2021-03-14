export interface ISelectOption{
    value: string;
    label: string;
    disabled?: boolean;
}

export class SelectOption implements ISelectOption{
    value: string = "";
    label: string = "";
    disabled: boolean;

    constructor(value: string, label: string, disabled : boolean = false){
        this.value = value;
        this.label = label;
        this.disabled = disabled;
    }
}