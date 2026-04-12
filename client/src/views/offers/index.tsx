import { Link } from "react-router";
import { useGetProducts } from "../../hooks/product/useGetProducts";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useDeleteProduct } from "../../hooks/product/useDeleteProduct";
import toast from "react-hot-toast";



const ManageOffers = () => {
  const { data: products } = useGetProducts();
  const {mutate} = useDeleteProduct();

  const handleDelete = (id:string) =>{
    if (window.confirm("Are you sure you want to delete this product?")) {
      mutate(id, {
        onSuccess: () => {
          toast.success("Product deleted successfully");
        },
        onError: () =>{
          toast.error("Failed to delete product");
        }
      });
    }
}

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">Manage Offers</h2>
      <Link to="/offers/create" className="btn btn-neutral mb-6">
        Add New Offer
      </Link>
      {products?.length === 0 ? (
        <p className="text-gray-500 text-xl">No products available.</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="grid grid-cols-[50px_1fr_100px_120px_120px] font-semibold border-b border-gray-300 pb-3 ">
          <div>
            <input type="checkbox" className="checkbox" />
          </div>
          <div>Title</div>
          <div>Stock</div>
          <div>Price</div>
          <div className="text-center">Action</div>
        </div>

        {/* Rows */}
        <div className="">
          {products?.map((product: any) => (
            <div
              key={product.id}
              className="grid grid-cols-[50px_1fr_100px_120px_120px] items-center py-4 rounded-lg hover:bg-gray-50 border-b border-gray-100 last:border-none"
            >
              <div>
                <input type="checkbox" className="checkbox" />
              </div>

              <div>{product.title}</div>
              <div>{product.stock}</div>
              <div>Rp {product.price.toLocaleString()}</div>

              {/* ACTION LANGSUNG */}
              <div className="flex justify-center gap-2">
                <details className="dropdown">
                  <summary className="btn btn-ghost">
                    <FaEllipsisVertical />
                  </summary>
                  <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li>
                      <Link to={`/offers/create?id=${product.id}`}>Edit</Link>
                    </li>
                    <li>
                      <a onClick={() => {}}>Archive</a>
                    </li>
                    <li>
                      <a onClick={() =>{handleDelete(product.id)}}>Delete</a>
                    </li>
                  </ul>
                </details>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      
    </div>
  );
};

export default ManageOffers;
