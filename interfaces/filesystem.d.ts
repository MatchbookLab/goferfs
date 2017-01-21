import IAdapter from './adapter';

declare interface IFilesystem extends IAdapter {
    // reserved to add high level methods that Adapters won't implement
}

export default IFilesystem;
