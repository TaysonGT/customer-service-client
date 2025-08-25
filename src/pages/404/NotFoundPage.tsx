import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return(
        <div className='w-screen h-screen flex flex-col justify-center items-center text-6xl text-blue-500'>
            <h1 className='font-bold'>Error 404!</h1>
            <p className='text-xl'>Page not found!</p>
            <Link to='/' className='text-base py-2 px-4 text-white bg-blue-500 font-semibold hover:bg-blue-400 duration-100 rounded-sm mt-6'>
                Redirect to home page
            </Link>
        </div>
    )
}

export default NotFoundPage