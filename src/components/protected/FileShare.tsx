import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const FileShare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const file = location.state;

  const [expiry, setExpiry] = useState("24h");
  const [shareLink, setShareLink] = useState("");
  const [error, setError] = useState<string>();
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    console.log(file);
  }, []);

  const handleGenerateLink = async () => {
    try{
      setError("");
      setShareLink("");
      setGenerating(true);

      const token = localStorage.getItem("accessToken");
      const res = await fetch('http://localhost:5000/api/share/links/generate', {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fileId: file.id, duration: expiry })
      });
      const data = await res.json();
      setShareLink(`http:localhost:5000/api/share/${data.shareId}`);
    }catch(err){
      console.error("File open error", err);
      setError("Could not generate share link. Please try again.");
    }finally{
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="mb-4"
      >
        ← Go back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">{file.filename}</CardTitle>
          {error && <p className="text-red-500 text-sm m-2 mt-1">{error}</p>}
          {generating && <p className="text-gray-800 text-sm m-2 mt-1">Generating...</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Size:</strong> {Math.round(file.size / 1024)} KB</p>
            <p><strong>Type:</strong> {file.contentType}</p>
            <p><strong>Uploaded:</strong> {new Date(file.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Expiry</label>
            <select
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="1h">1 hour</option>
              <option value="24h">24 hours</option>
              <option value="7d">7 days</option>
            </select>
          </div>

          <Button onClick={handleGenerateLink} className="w-full">
            Generate Share Link
          </Button>

          {shareLink && (
            <div className="space-y-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="w-full border rounded px-2 py-1"
              />
              <Button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="w-full"
              >
                Copy Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileShare;