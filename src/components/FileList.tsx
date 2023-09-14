type props = {
	fileList: string[];
	handleDelete: any;
	handleSummary: any;
	handleDownload: any;
	selectedFile: any;
	setSelectedFile: any;
};

function FileList({
	fileList,
	handleDelete,
	handleSummary,
	handleDownload,
	selectedFile,
	setSelectedFile,
}: props) {
	return (
		<div className="flex flex-col">
			{fileList.length === 0 ? (
				<div className="flex w-full justify-center text-gray-600 font-bold mt-10">
					No Files
				</div>
			) : (
				fileList.map((file: any) => (
					<div
						className={`flex p-2 h-auto w-full ${
							selectedFile === file.id ? "bg-gray-100" : ""
						}`}
						key={file.id}
					>
						{selectedFile === file.id ? (
							<div className="flex flex-col w-full items-center">
								<div className="flex mt-2">
									<button
										className="btn btn-info btn-sm"
										onClick={() => {
											setSelectedFile(null);
											handleSummary(file.id);
										}}
									>
										Summary
									</button>
									<button
										className="btn btn-info btn-sm ml-2"
										onClick={() => {
											setSelectedFile(null);
											handleDownload(file.id);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
											/>
										</svg>
									</button>
									<button
										className="btn btn-info btn-sm ml-2"
										onClick={() => setSelectedFile(null)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
											/>
										</svg>
									</button>
								</div>
							</div>
						) : (
							<div className="flex items-center w-full">
								<div
									className="ml-2 text-[#4631fb]"
									onClick={() => setSelectedFile(file.id)}
								>
									{file.file_name.endsWith(".png") ||
									file.file_name.endsWith(".jpg") ||
									file.file_name.endsWith(".jpeg") ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
											/>
										</svg>
									)}
								</div>
								<div
									className="ml-5 font-mono text-base mr-2 w-32 h-10 flex items-center overflow-hidden"
									onClick={() => setSelectedFile(file.id)}
								>
									<div className="truncate">
										{file.file_name}
									</div>
								</div>
								<button
									className="text-black hover:opacity-30 ml-auto"
									onClick={() => handleDelete(file.id)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</button>
							</div>
						)}
					</div>
				))
			)}
		</div>
	);
}

export default FileList;
