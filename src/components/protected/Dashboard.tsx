import { useState } from "react" 
import Sidebar from "./Sidebar"
import UploadPage from "./Upload"
import FileList from "./FileList"

const Dashboard = () => {
	const [active, setActive] = useState("Upload")
  
	return (
		<div className="flex min-h-screen">
			<aside className="w-64 bg-gray-100 border-r sticky top-0 h-screen">
			<Sidebar active={active} setActive={setActive} />
			</aside>
			<main className="flex-1 p-6 overflow-y-auto">
			{active === "Upload" && <UploadPage />}
			{active === "My Files" && <FileList/>}
			{active === "Downloads" && <div>Downloads section here</div>}
			</main>
		</div>
	)
  }
  
  export default Dashboard