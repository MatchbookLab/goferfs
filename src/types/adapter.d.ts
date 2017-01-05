import IReader from './reader';
import IWriter from './writer';

declare interface IAdapter extends IReader, IWriter {}

export default IAdapter;
