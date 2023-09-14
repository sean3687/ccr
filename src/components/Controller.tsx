import { useState } from "react";
import FileController from "./FileController.tsx";
import ChatController from "./ChatController.tsx";
import moment from "moment";
import Div100vh from "react-div-100vh";
import axios from "axios";

function Controller() {
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState<any[]>([]);
	const [isSideBarOpen, setIsSideBarOpen] = useState(false);

	const handleClick = async () => {
		setIsLoading(true);

		// const message
		const sendTime = moment().format("h:mm");
		const myMessage = { sender: "me", message: inputText, time: sendTime };
		const botLoadingMessage = {
			sender: "bot-loading",
			message: "",
			time: sendTime,
		};
		const messageArr = [...messages, myMessage, botLoadingMessage];
		setMessages(messageArr);

		setInputText("");
		const data = {
			message: inputText,
		};
		// Console log test
		console.log(data);

		await fetch("http://127.0.0.1:8000/chain", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
			body: JSON.stringify(data),
		})
			.then(async (res: any) => {
				if (res.ok) {
					const mes = await res.json();
					console.log(mes);
					const botTime = moment().format("h:mm");
					const botMessage = {
						sender: "bot",
						message: mes.message,
						file_id: mes.file_id,
						file_name: mes.file_name,
						time: botTime,
					};
					messageArr.pop();
					messageArr.push(botMessage);
					setMessages(messageArr);
				} else {
					messageArr.pop();
					if (res.status === 401) {
						window.alert("please login first");
					} else if (res.status === 400) {
						const mes = await res.json();
						window.alert(mes.detail);
					} else {
						window.alert("An error occurred.");
					}
				}
			})
			.catch((err: any) => {
				console.log(err);
			});

		setIsLoading(false);
	};

	const handleRefresh = async () => {
		const confirmDelete = window.confirm("Are you sure to refresh?");
		if (!confirmDelete) {
			return;
		}
		await fetch("http://127.0.0.1:8000/clear_chat_history", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
		})
			.then(async (res: any) => {
				if (res.ok) {
					setMessages([]);
				} else if (res.status === 401) {
					window.alert("please login first");
				} else {
					const mes = await res.json();
					console.log(mes);
					window.alert(mes.detail);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	};

	const handleSummary = async (id: string) => {
		try {
			setIsLoading(true);
			const sendTime = moment().format("h:mm");
			const botLoadingMessage = {
				sender: "bot-loading-s",
				message: "",
				time: sendTime,
			};
			const messageArr = [...messages, botLoadingMessage];
			setMessages(messageArr);

			const res = await fetch("http://127.0.0.1:8000/summary/" + id, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem(
						"accessToken"
					)}`,
				},
			});
			if (res.ok) {
				// summary logic
				const mes = await res.json();
				console.log(mes);
				const botTime = moment().format("h:mm");
				const botMessage = {
					sender: "bot-s",
					message: mes,
					time: botTime,
				};
				messageArr.pop();
				messageArr.push(botMessage);
				setMessages(messageArr);
			} else {
				messageArr.pop();
				const mes = await res.json();
				console.log(mes);
				window.alert(mes.detail);
			}
		} catch (err) {
			console.log(err);
			window.alert("Delete Error.");
		}
		setIsLoading(false);
	};

	const handleDownload = async (id: string) => {
		// download file
		try {
			const response = await axios.get(
				`http://127.0.0.1:8000/download_file/${id}`,
				{
					responseType: "blob",
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"accessToken"
						)}`,
					},
				}
			);

			const blob = new Blob([response.data], {
				type: response.headers["content-type"],
			});
			const url = URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.target = "_blank";
			link.rel = "noopener noreferrer";
			link.click();

			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	return (
		<Div100vh>
			<div className="flex z-0 drawer lg:drawer-open h-full">
				<label
					htmlFor="my-drawer"
					className={
						"drawer-overlay w-full h-full absolute top-0 right-0 bottom-0 left-0 z-10 bg-black opacity-20" +
						(isSideBarOpen ? " block" : " hidden")
					}
					onClick={() => {
						setIsSideBarOpen(false);
					}}
				></label>
				<input
					id="my-drawer"
					type="checkbox"
					className="drawer-toggle"
				/>
				<div
					className={
						"drawer-side h-full w-[260px] z-10 lg:shadow-2xl lg:shadow-[#b3b6e6]"
					}
				>
					<FileController
						handleSummary={handleSummary}
						handleDownload={handleDownload}
					/>
				</div>
				<div className="drawer-content flex-1 h-full z-0">
					<ChatController
						inputText={inputText}
						isLoading={isLoading}
						messages={messages}
						setIsSideBarOpen={setIsSideBarOpen}
						setInputText={setInputText}
						handleClick={handleClick}
						handleRefresh={handleRefresh}
						handleDownload={handleDownload}
					/>
				</div>
			</div>
		</Div100vh>
	);
}

export default Controller;
