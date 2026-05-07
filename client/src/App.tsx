import Navbar from "./components/navbar";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from "react-loading-skeleton";
import { ThemeProvider } from "./context/ThemeContext";
import { useSEO } from "./hooks/helpers/useSEO";

const App = () => {
  useSEO({});
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg pt-20 ">
      <Navbar />
      <Toaster />

      <div className="pb-20 md:pb-0">
        <SkeletonTheme baseColor="#757373" highlightColor="#a7a3a3">
          <AppRoutes/>
        </SkeletonTheme>
      </div>
    </div>
    </ThemeProvider>
  );
};

export default App;