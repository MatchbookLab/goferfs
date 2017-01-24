import * as Stream from 'stream';

import IMetadata from './metadata';

declare interface IStreamFile extends IMetadata {
    stream: Stream;
}

export default IStreamFile;
