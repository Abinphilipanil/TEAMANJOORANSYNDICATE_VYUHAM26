import { PDFParse } from 'pdf-parse';

export interface ExtractedDocument {
  text: string;
  wordCount: number;
  characterCount: number;
  pageCount?: number;
  isPdf: boolean;
}

export class PdfExtractor {
  public static readonly MAX_TEXT_LENGTH = 40000; // ~8,000 words maximum

  /**
   * Extracts clean, normalized plain text from a resume buffer.
   * Handles both real PDF binaries and plain-text fallback buffers safely.
   */
  public async extractText(buffer: Buffer, fileName?: string): Promise<ExtractedDocument> {
    if (!buffer || buffer.length === 0) {
      return {
        text: '',
        wordCount: 0,
        characterCount: 0,
        isPdf: false,
      };
    }

    // Check if buffer starts with PDF magic number %PDF
    const isPdfHeader = buffer.slice(0, 5).toString('ascii').startsWith('%PDF');

    if (isPdfHeader) {
      try {
        const parser = new PDFParse({ data: buffer });
        const textResult = await parser.getText();
        const rawText = typeof textResult === 'string' ? textResult : textResult.text || '';
        const pageCount = typeof textResult === 'object' && textResult !== null ? textResult.total : undefined;
        
        let cleaned = this.sanitizeText(rawText);
        if (cleaned.length > PdfExtractor.MAX_TEXT_LENGTH) {
          cleaned = cleaned.slice(0, PdfExtractor.MAX_TEXT_LENGTH) + '\n\n[...Resume text truncated for length limit]';
        }

        const wordCount = cleaned.trim().split(/\s+/).filter(Boolean).length;

        return {
          text: cleaned,
          wordCount,
          characterCount: cleaned.length,
          pageCount,
          isPdf: true,
        };
      } catch (err: any) {
        // If PDF parsing fails, attempt text decode fallback
        console.warn(`[PdfExtractor] PDFParse warning for ${fileName || 'resume'}: ${err.message}. Attempting text fallback.`);
      }
    }

    // Plain text fallback (e.g. sample candidate resumes or text uploads)
    const utf8Text = buffer.toString('utf-8');
    let cleaned = this.sanitizeText(utf8Text);
    if (cleaned.length > PdfExtractor.MAX_TEXT_LENGTH) {
      cleaned = cleaned.slice(0, PdfExtractor.MAX_TEXT_LENGTH) + '\n\n[...Resume text truncated for length limit]';
    }
    const wordCount = cleaned.trim().split(/\s+/).filter(Boolean).length;

    return {
      text: cleaned,
      wordCount,
      characterCount: cleaned.length,
      isPdf: false,
    };
  }

  /**
   * Sanitizes text by normalizing excessive whitespace, tabs, and non-printable control characters.
   */
  private sanitizeText(raw: string): string {
    if (!raw) return '';
    return raw
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ') // Strip non-printable ASCII control chars
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, '  ')
      .replace(/[ \t]{3,}/g, '  ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}

export const pdfExtractor = new PdfExtractor();
