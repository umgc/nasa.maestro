export class ConversionResponse {
  response: {
    status: '1' | '0';
    isIdentical: boolean;
    isValid: boolean;
    imageASize: number;
    imageBSize: number;
    pixelDiff: number;
    percentDiff: string;
  };
  diffLink: string;
  imageLinks: Array<{ url: string }>;
}
