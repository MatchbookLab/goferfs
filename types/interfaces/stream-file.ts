import { Readable } from 'stream';

import { Metadata } from '../index';

export interface StreamFile extends Metadata {
  stream: Readable;
}
