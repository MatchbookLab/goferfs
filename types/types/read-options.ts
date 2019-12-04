import { Encoding } from './encoding';

export type ReadOptions = {
  encoding?: Encoding, // null by default (i.e. returns Buffer)
};
