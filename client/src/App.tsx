import Navbar from "./components/navbar";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from "react-loading-skeleton";

const App = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <Toaster />

      <div className="max-w-7xl mx-auto">
        <SkeletonTheme baseColor="#757373" highlightColor="#a7a3a3">
          <AppRoutes/>
        </SkeletonTheme>
      </div>
    </div>
  );
};

export default App;