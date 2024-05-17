export interface StorageRepository {
  getNumberOfFiles(): Promise<number>;
}
