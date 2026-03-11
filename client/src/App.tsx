import Navbar from "./components/navbar";
import AppRoutes from "./routes";

const App = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <Navbar />

      <div className="container mt-5">
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;