declare interface IAdapter {
    /**
     * Check whether a file exists.
     */
    exists(path: string): Promise<boolean>;
}

export default IAdapter;
