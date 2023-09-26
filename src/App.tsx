import { useEffect, useState } from "react";
import "./App.css";
import KanbanBoard from "./components/KanbanBoard";
import Dark from "./icons/Dark";
import Sun from "./icons/Sun";

function App() {

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC

  if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  const [theme, setTheme] = useState(localStorage.theme || "dark")
  function handleTheme() {
    const themePref = localStorage.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", themePref)
    // localStorage.theme = themePref
    setTheme(themePref)


  }
  return (
    <>
      <div className="flex px-10 py-5 justify-end" onClick={handleTheme}>
        {theme === "light" ? <Sun /> : <Dark />}
      </div>
      <KanbanBoard />
    </>
  );
}

export default App;
