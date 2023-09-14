import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track password match

	const handleToggle = () => {
		setIsLogin((prevIsLogin) => !prevIsLogin);
	};

	const handleLogin = async () => {
		await fetch("http://54.193.180.218:8000/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				username: email,
				password: password,
			}),
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else if (response.status === 401) {
					window.alert("Username or password is incorrect.");
				} else {
					console.error("Login failed", response);
					window.alert("Login failed.");
				}
			})
			.then((res: any) => {
				console.log(res);
				localStorage.setItem("accessToken", res.access_token);
				navigate("/chat");
			})
			.catch((err: any) => {
				console.error(err);
				window.alert("An error occurred.");
			});
	};

	const handleRegister = async () => {
		await fetch("http://54.193.180.218:8000/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: email,
				password: password,
			}),
		})
			.then(async (res: any) => {
				if (res.ok) {
					console.log("res.ok");
					window.alert("Registration successful.");
					setIsLogin(true);
				} else {
					if (res.status === 400) {
						window.alert("Username already exists.");
					} else {
						window.alert("Another error occurred.");
					}
				}
			})
			.catch((err: any) => {
				console.error(err);
				window.alert("An error occurred.");
			});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isLogin) {
			handleLogin();
		} else {
			if (password === confirmPassword) {
				if (email && password && confirmPassword) {
					handleRegister();
				} else {
					window.alert("Please fill in all registration fields.");
				}
			} else {
				window.alert("Passwords do not match.");
			}
		}
	};

	return (
		<div className="min-h-screen flex justify-center items-center bg-gray-100">
			<div className="p-8 bg-white rounded shadow-md w-full max-w-md">
				<h2 className="text-2xl font-semibold mb-4">
					{isLogin ? "Login" : "Register"}
				</h2>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block mb-1">Email</label>
						<input
							type="email"
							className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="block mb-1">Password</label>
						<input
							type="password"
							className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{!isLogin && (
						<div>
							<label className="block mb-1">
								Confirm Password
							</label>
							<input
								type="password"
								className={`w-full border rounded p-2 focus:outline-none ${
									passwordsMatch
										? "focus:border-blue-500"
										: "border-red-500"
								}`}
								placeholder="Confirm your password"
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									setPasswordsMatch(
										e.target.value === password
									);
								}}
								required
							/>
							{!passwordsMatch && (
								<p className="text-red-500 mt-2">
									Passwords do not match.
								</p>
							)}
						</div>
					)}
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
					>
						{isLogin ? "Login" : "Register"}
					</button>
				</form>
				<p className="text-center mt-4">
					{isLogin
						? "Don't have an account?"
						: "Already have an account?"}
					<span
						className="text-blue-500 cursor-pointer"
						onClick={handleToggle}
					>
						{isLogin ? " Register here" : " Login here"}
					</span>
				</p>
			</div>
		</div>
	);
};

export default Login;
