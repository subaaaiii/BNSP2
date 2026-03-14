import Navbar from "./components/navbar";
import AppRoutes from "./routes";

const App = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-5">
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;