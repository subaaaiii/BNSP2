import Navbar from "./components/navbar";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <Toaster />

      <div className="max-w-7xl mx-auto mt-5">
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;