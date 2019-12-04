import { Metadata } from '../index';

export interface File extends Metadata {
  contents: string | Buffer;
}
