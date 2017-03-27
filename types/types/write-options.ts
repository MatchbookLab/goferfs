import Visibility from './visibility';
import Encoding from './encoding';

type WriteOptions = {
    visibility?: Visibility, // defaults to Public
    encoding?: Encoding, // defaults to utf8 (ignored for Buffers)
};

export default WriteOptions;
