import { useCallback, useRef, useState } from "react";
import Papa from "papaparse";
import { Upload, FileCheck, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CsvUploaderProps {
  label: string;
  description: string;
  requiredColumns: string[];
  onParsed: (data: Record<string, unknown>[]) => void;
}

export function CsvUploader({ label, description, requiredColumns, onParsed }: CsvUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete(results) {
          const headers = results.meta.fields || [];
          const missing = requiredColumns.filter((c) => !headers.includes(c));
          if (missing.length > 0) {
            setError(`Missing columns: ${missing.join(", ")}`);
            setPreview([]);
            return;
          }
          const data = results.data as Record<string, unknown>[];
          setPreview(data.slice(0, 5));
          onParsed(data);
        },
        error(err) {
          setError(err.message);
        },
      });
    },
    [requiredColumns, onParsed]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-card-foreground mb-1">{label}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {fileName ? (
          <div className="flex items-center justify-center gap-2 text-success">
            <FileCheck className="h-5 w-5" />
            <span className="font-medium">{fileName}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <span>Drop CSV or click to upload</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {preview.length > 0 && (
        <div className="mt-3 overflow-x-auto rounded border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted">
                {Object.keys(preview[0]).map((h) => (
                  <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="px-2 py-1 whitespace-nowrap text-card-foreground">
                      {String(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
