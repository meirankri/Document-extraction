declare module "pdf-parse" {
  interface PDFParseOptions {
    version?: string;
  }

  interface PDFPage {
    pageIndex: number;
    pageInfo: {
      num: number;
      gen: number;
      size: number;
      sizeInBytes: number;
    };
  }

  interface PDFDocumentProxy {
    numPages: number;
    fingerprint: string;
    getPage(num: number): Promise<PDFPage>;
  }

  interface PDFMetadata {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    producer?: string;
    creator?: string;
    creationDate?: Date;
    modDate?: Date;
  }

  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: PDFMetadata;
    metadata: any;
    text: string;
    version: string;
  }

  function pdf(
    dataBuffer: Buffer,
    options?: PDFParseOptions
  ): Promise<PDFParseResult>;

  export = pdf;
}
