import * as Stream from 'stream';

import { File, Metadata, ReadOptions, StreamFile, Visibility, WriteOptions } from '../index';

export interface IAdapter<TAdapter> {
  ////////////////
  // PROPERTIES //
  ////////////////

  adapterName: string;

  targetVersion: string;

  //////////////////
  // READ METHODS //
  //////////////////

  /**
   * Check whether a file exists.
   */
  exists(path: string): Promise<boolean>;

  /**
   * Read a file.
   */
  read(path: string, options: ReadOptions): Promise<File>;

  /**
   * Read a file as a stream.
   */
  readStream(path: string, options: ReadOptions): Promise<StreamFile>;

  /**
   * Get all the meta data of a file or directory.
   */
  getMetadata(path: string): Promise<Metadata>;

  /**
   * Get the visibility of a file.
   */
  getVisibility(path: string): Promise<Visibility>;

  ///////////////////
  // WRITE METHODS //
  ///////////////////

  /**
   * Write a file.
   */
  write(path: string, contents: string | Buffer, options: WriteOptions): Promise<Metadata>;

  /**
   * Write a file using a stream.
   */
  writeStream(path: string, stream: Stream, options: WriteOptions): Promise<Metadata>;

  /**
   * Rename a file.
   */
  move(oldPath: string, newPath: string): Promise<Metadata>;

  /**
   * Copy a file.
   */
  copy(oldPath: string, clonedPath: string): Promise<Metadata>;

  /**
   * Delete a file.
   */
  delete(path: string): Promise<boolean>;

  /**
   * Delete a directory.
   */
  deleteDir(path: string): Promise<boolean>;

  /**
   * Create a directory.
   */
  createDir(path: string): Promise<Metadata>;

  /**
   * Set the visibility for a file.
   */
  setVisibility(path: string, visibility: Visibility): Promise<Metadata>;
}
