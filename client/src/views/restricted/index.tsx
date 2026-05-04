import { Link } from 'react-router'
import imgRestricted from '../../assets/restricted.png'
const RestrictedPage=()=>{
    return(
        <div className="max-w-6xl mx-auto flex">
            <img src={imgRestricted} alt="Restricted Access" />
            <div className="flex flex-col items-center justify-center">
                <h1 className='text-5xl font-bold text-gray-700 mb-4'>FORBIDDEN</h1>
                <h1 className='text-8xl font-bold  mb-4'>403</h1>
                <p className="text-3xl text-center font-semibold text-gray-700 mb-4">We are sorry, but you don't have access to this page or resource.</p>
                <Link to="/" className='text-3xl text-white font-bold bg-gray-900 hover:bg-gray-700 rounded-md py-4 px-8'>Back to Homepage</Link>
            </div>
        </div>
    )
}
export default RestrictedPage