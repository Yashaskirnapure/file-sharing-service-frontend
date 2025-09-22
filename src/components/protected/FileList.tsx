import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useAuth } from "@/context/useAuth";

interface FileResponseDTO {
  id: string;
  filename: string;
  size: number;
  contentType: string;
  createdAt: string;
}

const FileList = () => {
  const [files, setFiles] = useState<FileResponseDTO[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchFiles(): Promise<void> {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:5000/api/file`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.status}`);
        }

        const data: FileResponseDTO[] = await response.json();
        setFiles(data);
      } catch (err) {
        console.error("Upload error:", err);
        setError("Could not load files.");
      } finally {
        setLoading(false);
      }
    }

    fetchFiles();
  }, []);

  const handleFileOpen = async (id: string) => {
    try {
      setError("");
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:5000/api/file/view/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        logout();
        return;
      }
      if (!response.ok) {
        throw new Error("Could not open file for viewing. Please try again.");
      }

      const { accessUrl } = await response.json();
      window.open(accessUrl, "_blank");
    } catch (err) {
      console.error("File open error", err);
      setError("Could not open file for viewing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((f) => f.id));
    }
  };

  const handleFileDelete = async () => {
    if (selectedFiles.length === 0) return;
    try {
      setError("");
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/api/file/delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileIds: selectedFiles }),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error("Could not delete files. Please try again.");
      }

      setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.id)));
      setSelectedFiles([]);
    } catch (err) {
      console.error("File delete error", err);
      setError("Could not delete files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Your Files</CardTitle>
        {selectedFiles.length > 0 && (
          <Button
            onClick={handleFileDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Selected ({selectedFiles.length})
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 text-sm m-2 mt-1">{error}</p>}
        {loading ? (
          <p className="text-gray-500">Loading files...</p>
        ) : files.length === 0 ? (
          <p className="text-gray-500">No files available</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === files.length}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Filename</TableHead>
                <TableHead>Size (KB)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                    />
                  </TableCell>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell>{Math.round(file.size / 1024)}</TableCell>
                  <TableCell>{file.contentType}</TableCell>
                  <TableCell>
                    {new Date(file.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleFileOpen(file.id)}>Open</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default FileList;