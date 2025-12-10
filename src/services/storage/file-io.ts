/**
 * Browser file I/O utilities for offline-first file handling
 * Handles: Blob download, file picker, and drag-drop reading
 */

import { FILE_OPERATION_TIMEOUT } from '@core/constants';

/** Result of file read operation */
export interface FileReadResult {
  content: string;
  fileName: string;
  size: number;
}

/** Options for file picker */
export interface FilePickerOptions {
  accept?: string;
  multiple?: boolean;
}

/**
 * Download blob as file
 * @param blob The blob to download
 * @param fileName Name of the file to save as
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  // Create object URL for download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Open file picker and read single file
 * @param options File picker options (accept, multiple)
 * @returns Promise resolving to file content or array of contents
 */
export function openFilePicker(
  options: FilePickerOptions = { accept: '.json' }
): Promise<FileReadResult | FileReadResult[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept || '';
    input.multiple = options.multiple || false;

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;

      if (!files || files.length === 0) {
        reject(new Error('No file selected'));
        return;
      }

      try {
        if (options.multiple && files.length > 1) {
          const results: FileReadResult[] = [];
          for (const file of files) {
            results.push(await readFile(file));
          }
          resolve(results);
        } else {
          const result = await readFile(files[0]);
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    };

    input.onerror = () => reject(new Error('File picker cancelled'));
    input.click();
  });
}

/**
 * Read single file to string
 * @param file File object to read
 * @returns Promise resolving to FileReadResult
 */
export function readFile(file: File): Promise<FileReadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const timeoutId = setTimeout(() => {
      reader.abort();
      reject(new Error('File read timeout'));
    }, FILE_OPERATION_TIMEOUT);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      clearTimeout(timeoutId);
      const content = e.target?.result as string;
      resolve({
        content,
        fileName: file.name,
        size: file.size,
      });
    };

    reader.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    reader.readAsText(file);
  });
}

/**
 * Convert object to JSON blob
 * @param obj Object to serialize
 * @param pretty Whether to pretty-print JSON
 * @returns Blob containing JSON
 */
export function objectToBlob(obj: any, pretty = true): Blob {
  const json = pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  return new Blob([json], { type: 'application/json' });
}
