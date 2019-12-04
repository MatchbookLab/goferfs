import { Visibility } from '../index';

export interface Metadata {
  name: string;
  ext: string;
  path: string;
  parentDir: string;
  visibility: Visibility;
  size: number;
  isFile: boolean;
  isDir: boolean;
  timestamp: Date;
  mimetype: string;
}
