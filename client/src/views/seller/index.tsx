import { useNavigate } from "react-router";
import { useSEO } from "../../hooks/helpers/useSEO";

const BecomeSeller = () => {
  const navigate = useNavigate();
  useSEO({
      title: `Buy SubGAME official sellers`,
      description: `Sell earn and grow with SubGAME together`,
    });

  return (
    <div className="min-h-screen bg-bg py-10 px-4">
      <div className="max-w-4xl mx-auto bg-bg rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-text mb-4">
          Jadi Seller di Platform Kami 🚀
        </h1>
        <p className="text-gray1 mb-6">
          Mulai jual akun game kamu dengan mudah dan jangkau lebih banyak
          pembeli tanpa ribet.
        </p>

        {/* Keuntungan */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Keuntungan Menjadi Seller
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-gray1">
            <li>Jangkauan pasar lebih luas</li>
            <li>Mudah mengelola produk & harga</li>
            <li>Sistem transaksi otomatis</li>
            <li>Dashboard monitoring penjualan</li>
          </ul>
        </div>

        {/* Informasi tambahan */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Persyaratan
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-gray1">
            <li>Memiliki akun aktif</li>
            <li>Produk yang dijual valid & tidak melanggar aturan</li>
            <li>Melengkapi data profil</li>
            <li>Melengkapi data diri berupa identitas dan informasi bank</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/apply-seller")}
            className="bg-secondary1 font-medium text-bg px-6 py-3 rounded-lg  transition cursor-pointer"
          >
            Ajukan Menjadi Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;