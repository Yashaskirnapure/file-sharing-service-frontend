import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileIcon, ImageIcon, FileTextIcon, DownloadIcon } from "lucide-react";
import { useAuth } from "@/context/useAuth";

type FileType = "image" | "pdf" | "other";

const View = () => {
  const [fileType, setFileType] = useState<FileType>("image");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();
  const { logout } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchFile = async () => {
      try {
        setError("");
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:5000/api/file/view/${id}`, {
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
        setFileUrl(accessUrl);

        // Guess type from extension
        if (/\.(png|jpg|jpeg|gif|webp)$/i.test(accessUrl)) setFileType("image");
        else if (/\.pdf$/i.test(accessUrl)) setFileType("pdf");
        else setFileType("other");
      } catch (err) {
        console.error("File open error", err);
        setError("Could not open file for viewing. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [id, logout]);

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {fileType === "image" && <ImageIcon className="w-5 h-5" />}
            {fileType === "pdf" && <FileTextIcon className="w-5 h-5" />}
            {fileType === "other" && <FileIcon className="w-5 h-5" />}
            File Viewer
          </CardTitle>

          {fileUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={fileUrl} download>
                <DownloadIcon className="w-4 h-4 mr-1" /> Download
              </a>
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-10">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-sm text-center py-10">{error}</p>
          ) : (
            <Tabs defaultValue={fileType}>
              <TabsList className="mb-4">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="pdf">PDF</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              <TabsContent value="image">
                <div className="flex justify-center">
                  <img
                    src={fileUrl}
                    alt="Preview"
                    className="rounded-lg max-h-[500px] object-contain"
                  />
                </div>
              </TabsContent>

              <TabsContent value="pdf">
                <iframe
                  src={fileUrl}
                  className="w-full h-[500px] border rounded-lg"
                  title="PDF Viewer"
                />
              </TabsContent>

              <TabsContent value="other">
                <div className="flex flex-col items-center justify-center py-10 text-sm text-muted-foreground border rounded-lg">
                  <FileIcon className="w-10 h-10 mb-2" />
                  <p>Cannot preview this file type.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default View;