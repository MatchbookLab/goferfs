import { Encoding } from './encoding';
import { Visibility } from './visibility';

export type WriteOptions = {
  visibility?: Visibility, // defaults to Public
  encoding?: Encoding, // defaults to utf8 (ignored for Buffers)
};
