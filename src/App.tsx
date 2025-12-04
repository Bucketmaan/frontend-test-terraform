import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { getItems } from "./api/items";

interface Item {
    id: number;
    name: string;
    description: string;
}

function App() {
    const [items, setItems] = useState<Item[]>([]);

    const onButtonClick = async () => {
        try {
            const itemsData = await getItems();
            setItems(itemsData);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={onButtonClick}>Load Items</button>
                {items.length > 0 && (
                    <ul>
                        {items.map((item: Item) => (
                            <li key={item.id}>
                                {item.name} / {item.description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
