import IMetadata from './metadata';

declare interface IFile extends IMetadata {
    contents: string;
}

export default IFile;
