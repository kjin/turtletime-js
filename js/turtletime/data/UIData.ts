namespace TurtleTime {
    export interface UITemplateData {
        id: string,
        subs?: Array<string>
    }

    export interface UIContainerData {
        anchor: Array<number>,
        position: Array<string>,
        size: Array<string>
    }

    export interface UISpriteData {
        spriteID?: string,
        category?: string,
        animation?: string,
        tint? : string
    }

    export interface UITextData {
        text?: string,
        font?: string,
        size?: number,
        justify?: string,
        valign?: string,
        tint?: string
    }

    export interface UIGeometryData {
        fillColor? : string;
        lineColor? : string;
        lineWeight? : string;
        cornerRadius? : string;
    }

    export interface UIAppearanceData {
        sprite? : UISpriteData,
        text? : UITextData,
        geometry? : UIGeometryData
    }

    export interface UIAppearanceCollectionData {
        normal?: UIAppearanceData
        toggled?: UIAppearanceData
    }

    export interface UIData {
        id: string,
        container?: UIContainerData,
        appearance?: UIAppearanceCollectionData,
        children?: Array<UIData>,
        template?: UITemplateData,
        generate?: string,
        type?: string,
        visible?: boolean,
        fadeVector?: Array<number|string>,
        mobile?: boolean
    }

    export interface UIDataCollection {
        templates: Array<UIData>,
        layout: UIData
    }
}