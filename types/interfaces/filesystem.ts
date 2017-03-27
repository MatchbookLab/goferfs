import IAdapter from './adapter';

declare interface IFilesystem<TAdapter> extends IAdapter<TAdapter> {
    // reserved to add high level methods that Adapters won't implement
}

export default IFilesystem;
