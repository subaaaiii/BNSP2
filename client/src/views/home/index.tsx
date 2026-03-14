
import Card from '../../components/card';

const Home = () => {
    return (
        <div className=" max-w-7xl mx-auto px-4 mb-2 bg-light rounded-5">
            <div className="container ">
                <h1 className="text-xl font-bold mb-4">Daftar Produk</h1>
                <div className="col-md-12 fs-4">
                    <Card/>
                </div>
            </div>
        </div>
    )
}

export default Home;
