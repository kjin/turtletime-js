namespace TurtleTime {
    export interface TextureFilterData {
        name: string,
        params: Array<any>
    }

    export interface DerivedTextureAssetEntry {
        id: string,
        source: Array<string>,
        action: TextureFilterData,
        frameSize?: Array<number>
    }

    export interface TextureAssetEntry {
        id: string,
        fileID?: string,
        fileType?: string,
        frameSize?: Array<number>
    }

    export interface AssetEntry {
        id: string
    }

    export interface AssetDocument {
        loadingBar: TextureAssetEntry,
        textures : {
            root: string,
            files: Array<TextureAssetEntry>,
            derivedFiles: Array<DerivedTextureAssetEntry>
        },
        json : {
            root: string,
            files: Array<AssetEntry>
        },
        fonts : {
            root: string,
            files: Array<AssetEntry>
        }
    }
}