export interface IDocMetadata {
  name: string;
}

export interface IGeneratedLink {
  docx: string;
  link: string;
}

export interface IComparisonResult {
  status: number;
  isIdentical: boolean;
  imageASize: number;
  imageBSize: number;
  pixelDiff: number;
  diffSize: number;
  percentDiff: string;
}

export interface IConversionResult {
  file: string;
  isValid: boolean;
}

export interface ISaveUpload {
  name: string;
  mimetype: string;
  size: number;
}
