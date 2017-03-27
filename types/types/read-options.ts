import Encoding from './encoding';

type ReadOptions = {
    encoding?: Encoding, // null by default (i.e. returns Buffer)
};

export default ReadOptions;
