import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/useAuth"

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([])
  const { logout } = useAuth();
  const [ error, setError ] = useState<string>('');
  const [ message, setMessage ] = useState<string>('');
  const [ uploading, setUploading ] = useState<boolean>(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setFiles(Array.from(e.dataTransfer.files))
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  async function handleUpload(){
    if(files.length === 0){
      console.log("no files")
      return;
    }
    try{
      setUploading(true);
      setError('');
      setMessage('');
      
      const token = localStorage.getItem('accessToken');
      const presignedURL = await fetch("http://localhost:5000/api/file/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            files: files.map((file) => ({
                      filename: file.name,
                      type: file.type,
                      size: file.size,
                      contentType: file.type
                  }))
          })
        }
      );

      if (presignedURL.status === 401) {
        logout();
        return;
      }

      if (!presignedURL.ok) throw new Error("Failed to get presigned URLs");
      const urls: { uploadUrl: string; filename: string }[] = await presignedURL.json();
      await Promise.all(
        files.map(async (file) => {
          const match = urls.find((u) => u.filename === file.name);
          if (!match) throw new Error(`No presigned URL for ${file.name}`);
  
          const uploadRes = await fetch(match.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });
  
          if (!uploadRes.ok) throw new Error(`Upload failed for ${file.name}`);
          console.log(`Uploaded: ${file.name}`);
        })
      );

      setMessage("Files Uploaded successfully");
    }catch(err){
      console.error("Upload error:", err);
      setError("Could not upload files.")
    }finally{
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-12 px-4">
		<div className="mb-8 text-center">
			<h1 className="text-3xl font-bold">File Upload</h1>
			<p className="text-sm text-muted-foreground mt-1">
				Drag & drop or select files to securely upload and share.
			</p>
		</div>
  

		<Card className="w-full max-w-2xl mx-auto shadow-lg">
        {uploading && <p className="text-gray-500 text-sm m-2 mt-1">Uploading.....</p>}
        {error && <p className="text-red-500 text-sm m-2 mt-1">{error}</p>}
        {message && <p className="text-green-700 text-sm m-2 mt-1">{message}</p>}
        <CardHeader>
			    <CardTitle className="text-center text-xl">Select Your Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          >
            <p className="text-gray-600">Drag & drop files here</p>
            <p className="text-sm text-gray-400">or</p>
            <div className="mt-2">
              <input
                type="file"
                id="fileInput"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                disabled={uploading}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                Choose Files
              </Button>
            </div>
          </div>

          <Button
            disabled={uploading || files.length === 0}
            className="mt-4 w-full text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUpload}
          >
            Upload Files
          </Button>

          {files.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm">
              {files.map((file, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                  <button
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UploadPage