import { IAdapter } from './adapter';

export interface IFilesystem<TAdapter> extends IAdapter<TAdapter> {
  // reserved to add high level methods that Adapters won't implement
}
