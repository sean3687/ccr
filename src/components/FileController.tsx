import Title from "./Title.tsx";
import FileList from "./FileList.tsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface UserInfo {
	id: number;
	username: string;
	chroma_path: string;
	openai_key: string;
	serp_key: string;
	email: string;
	full_name: string;
	disabled: boolean;
}

type props = {
	handleSummary: any;
	handleDownload: any;
};

function FileController({ handleSummary, handleDownload }: props) {
	const [userinfo, setUserInfo] = useState<UserInfo | null>(null); // State to track password match
	const [fileList, setFileList] = useState<string[]>([]); // State to track password match
	const [isUploading, setIsUploading] = useState<boolean>(false); // State to track password match
	const [selectedFile, setSelectedFile] = useState(null); // State to track selected file id
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		navigate("/login");
	};

	const getUserInfo = async () => {
		const res = await fetch("http://127.0.0.1:8000/users/me", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
		});
		if (res.ok) {
			const data = await res.json();
			setUserInfo(data);
		} else {
			console.log(res);
			window.alert("UserInfo Error.");
		}
	};

	const getFiles = async () => {
		try {
			const res = await fetch("http://127.0.0.1:8000/get_files", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem(
						"accessToken"
					)}`,
				},
			});
			if (res.ok) {
				const data = await res.json();
				setFileList(data);
			} else {
				console.log(res);
				window.alert("FileList Error.");
			}
		} catch (err) {
			console.log(err);
			window.alert("FileList Error.");
		}
	};

	useEffect(() => {
		getUserInfo();
		getFiles();
	}, []);

	const handleUpload = async (e: any) => {
		setIsUploading(true);
		const files = e.target.files || null;
		if (files) {
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append("files", files[i]);
			}

			await fetch("http://127.0.0.1:8000/uploadfiles", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem(
						"accessToken"
					)}`,
				},
				body: formData,
			})
				.then(async (response) => {
					if (response.ok) {
						getFiles();
					} else {
						console.log(response);
						const mes = await response.json();
						console.log(mes);
						window.alert(mes.detail);
					}
				})
				.catch((error) => {
					console.log(error);
					window.alert("An error occurred.");
				});
		}
		setIsUploading(false);
	};

	const handleDelete = async (id: string) => {
		// delete file
		const confirmDelete = window.confirm(
			"Are you sure to delete the file?"
		);
		if (!confirmDelete) {
			return;
		}
		try {
			const res = await fetch("http://127.0.0.1:8000/delete_file/" + id, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem(
						"accessToken"
					)}`,
				},
			});
			if (res.ok) {
				getFiles();
			} else {
				const mes = await res.json();
				console.log(mes);
				window.alert(mes.detail);
			}
		} catch (err) {
			console.log(err);
			window.alert("Delete Error.");
		}
	};

	return (
		<div className="bg-white">
			<div className="flex flex-col w-full items-center h-screen bg-base-200 ">
				<Title />
				<div className="sticky mr-44">
					<h3 className="h-9 pb-2 pt-3 px-3 text-xs text-gray-500 font-medium text-ellipsis overflow-hidden break-all">
						Files List
					</h3>
				</div>

				<div className="flex-auto mb-5 mt-3 w-full overflow-y-auto flex-shrink-0 h-80">
					<FileList
						fileList={fileList}
						handleDelete={handleDelete}
						handleSummary={handleSummary}
						handleDownload={handleDownload}
						selectedFile={selectedFile}
						setSelectedFile={setSelectedFile}
					/>
				</div>
				<div className="flex-initial mt-5">
					<label className="flex items-center justify-center bg-[#1b254a] p-2 border mb-5 rounded-full text-center w-48 hover:opacity-20 mx-3">
						<div className=" mr-4">
							{isUploading ? (
								<span className="loading loading-spinner text-info"></span>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-6 h-6 text-white"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
									/>
								</svg>
							)}
						</div>
						<div className="text-white font-mono text-sm">
							Upload File
						</div>
						<input
							type="file"
							className="hidden"
							multiple
							onChange={handleUpload}
						/>
					</label>

					<div className="border-t text-white p-2 flex items-center h-24">
						<div className="bg-black rounded-full mx-2">
							<img src="src/imgs/cat.png" className="h-10 w-10" />
						</div>
						<div className="truncate items-center mx-2 text-[#364162] font-bold w-24">
							{userinfo?.username}
						</div>
						<button
							className="text-[#364162] hover:text-gray-400 "
							onClick={handleLogout}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-8 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FileController;
