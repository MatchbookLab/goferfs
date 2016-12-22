# Filesystem Abstraction Library

**Note: this is not yet published on `npm`**

*(cooler name TBD)*

The goal of this library is to provide a high level common API surface for manipulating files, regardless of where they're actually stored, be it locally, or in the cloud, like Amazon S3.

It should be able to easily swap in different adapters (i.e. `s3` and `local` are (planned) adapters).

## API

_**Note:** The API is still a bit up in the air, so a few things may be changing_

The API is pretty straight forward:

```js
import Filesystem from 'filesystem';
import LocalAdapter from 'filesystem-adapter-local';

const filesystem = new Filesystem(new LocalAdapter({ baseName: '/path/to/root' }));

// there are (currently?) 3 ways to save files:
filesystem.write('test.txt', 'Contents'); // throws an error if file already exists
filesystem.update('test.txt', 'Contents'); // throws an error if the file does not exist
filesystem.put('test.txt', 'Contents'); // will write if file doesn't exist, otherwise update

// reading a file is straightforward:
const { contents } = await filesystem.read('test.txt');
console.log(contents); // "Contents"

// files are wrapped in metadata
const file = await filesystem.read('test.txt');
console.log(file); // prints something like:
{
  name: 'test.txt',
  ext: '.txt',
  path: '/path/to/root/test.txt',
  parentDir: '/path/to/root',
  size: 8,
  isFile: true,
  isDir: false,
  timestamp: Date('2016-12-22T20:17:27.000Z'),
  mimetype: 'text/plain',
  contents: 'Contents',
}

// if the directory doesn't exist, one is created for you
filesystem.put('this/path/does/not/yet/exist/test.txt', 'Contents');
// (this returns all of the same metadata above except `contents`)

// you can check to see if a file or directory exists:
const exists = await filesystem.has('does/not/exists'); // exists === false

// you can get the contents of a directory
const directory = await filesystem.listContents('some/dir');
// directory is an array of Metadata objects

// you can delete a file
filesystem.delete('test.txt');

// you can also (recursively) delete a dir
filesystem.deleteDir('some/dir');

// you can create an empty dir (or do nothing if it existed already)
filesystem.createDir('some/other/dir');

// you can even copy and rename (move) files:
filesystem.copy('test.txt', 'test2.txt');
filesystem.rename('test.txt', 'test1.txt');

// it of course supports streams
filesystem.writeStream('test.txt', someReadableStream);
const { stream } = filesystem.readStream('test.txt');
```

The API always returns a promise (some adapters may be able to do certain things synchronously, but for consistency, it returns promises as some adapters have to do thing async).

## Planned Features

### Caching

We want to make it so you can cache files, so if you are using cloud storage, you can cache files in Redis/memory/locally for faster access.

### Easy switching between adapters

We want to have it so you can easily use multiple adapters:

```js
const filesystem = new FilesystemManagter({
  s3: s3Adapter, // Amazon S3
  gcs: gcsAdapter, // Google Cloud Storage
});

filesystem.put('s3://test.txt', 'Contents');
filesystem.rename('s3://test.txt', 'gcs://test.txt');
```

### Lots of Adapters

Pretty self-explanatory

### Easy way to create your own adapter

We're using TypeScript so we can use interfaces that Adapters can implement, so it will be relatively easy to create a new adapter following that pattern (you don't *have* to use TypeScript, of course, it should help, though).

We also are working on a test suite so you can basically call `testSuite(myAdapter)` and it will run a bunch of tests to use as a good benchmark to get adapters working.

## Contributing

In these early stages, we would love some feedback on the [interfaces](src/types), especially. I would _definitely_ not be writing any adapters based on this yet, but once the API is stabilized, it would gladly welcome contributed adapters for various services. (The idea is that each adapter (except maybe `local` and `memory`?) will be in its own repo.)

## Similarities to the PHP League's Flysystem

This was heavily inspired by the awesome PHP package by the PHP League: [Flysytem](https://flysystem.thephpleague.com/). They definitely deserve some credit here.
