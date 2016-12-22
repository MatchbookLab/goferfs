import { Readable } from 'stream';

import IMetadata from './metadata';

declare interface IStreamFile extends IMetadata {
    stream: Readable;
}

export default IStreamFile;
