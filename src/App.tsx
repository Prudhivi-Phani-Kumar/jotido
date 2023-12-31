import { useEffect, useState } from "react";
import "./App.css";
import KanbanBoard from "./components/KanbanBoard";
import Moon from "./icons/Moon";
import Sun from "./icons/Sun";

function App() {

	const [theme, setTheme] = useState(localStorage.theme);
	const isDefaultSetToLightTheme = (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: light)").matches)

	useEffect(() => {
		if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [theme])

	function handleTheme() {
		const themePref = localStorage.theme === "light" || isDefaultSetToLightTheme ? "dark" : "light";
		localStorage.setItem("theme", themePref)
		setTheme(themePref)
	}

	return (
		<>
			<div className="flex px-10 py-3 justify-end">
				<span className="p-[8px] rounded-full cursor-pointer hover:bg-light-columnBackgroundColor dark:hover:bg-dark-columnBackgroundColor"
					onClick={handleTheme}>
					{(theme && theme === "light") || isDefaultSetToLightTheme ? <Sun /> : <Moon />}
				</span>
			</div>
			<KanbanBoard />
		</>
	);
}

export default App;
