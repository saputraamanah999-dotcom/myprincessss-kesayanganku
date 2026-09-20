export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  caption: string;
}

export interface LoveLetterConfig {
  greeting: string;
  bodyParagraphs: string[];
  closing: string;
  signature: string;
}
