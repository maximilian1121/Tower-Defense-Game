import React from "@rbxts/react";
import SnackbarProvider from "./components/toasting/snackbar";
import Hotbar from "./components/inventory/hotbar";

export default function App() {
	return <SnackbarProvider>
		<Hotbar/>
	</SnackbarProvider>;
}

