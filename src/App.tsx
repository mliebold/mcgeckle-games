import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <h1> Mcgeckle Games</h1>
    </ThemeProvider>
  );
}

export default App;
