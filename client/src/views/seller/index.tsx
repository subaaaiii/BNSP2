import { useNavigate } from "react-router";

const BecomeSeller = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Jadi Seller di Platform Kami 🚀
        </h1>
        <p className="text-gray-600 mb-6">
          Mulai jual akun game kamu dengan mudah dan jangkau lebih banyak
          pembeli tanpa ribet.
        </p>

        {/* Keuntungan */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Keuntungan Menjadi Seller
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-gray-700">
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

          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Memiliki akun aktif</li>
            <li>Produk yang dijual valid & tidak melanggar aturan</li>
            <li>Melengkapi data profil</li>
            <li>Melengkapi data diri berupa identitas dan informasi bank</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/seller/apply")}
            className="bg-neutral text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          >
            Ajukan Menjadi Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;