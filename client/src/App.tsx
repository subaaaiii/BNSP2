import Navbar from "./components/navbar";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from "react-loading-skeleton";

const App = () => {
  return (
    <div data-theme="mytheme" className="min-h-screen bg-bg pt-20 ">
      <Navbar />
      <Toaster />

      <div className="">
        <SkeletonTheme baseColor="#757373" highlightColor="#a7a3a3">
          <AppRoutes/>
        </SkeletonTheme>
      </div>
    </div>
  );
};

export default App;