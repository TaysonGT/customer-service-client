import { Link } from 'react-router'
import Form from './Form'

const LoginAgentPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[url(/src/assets/imgs/login-bg.webp)] bg-cover bg-center">
        <div className='flex bg-[linear-gradient(70deg,#E4E6E8,#FEEBAF)] lg:h-[90%] md:w-[90%] p-4 rounded-md lg:rounded-3xl shadow-hover'>
            <div className='flex flex-1/2 flex-col justify-center items-center text-main p-4 overflow-hidden'>
              <p className='text-md rounded-3xl border border-secondary-text p-3 px-6 text-secondary-text self-start mb-6'>Sign In</p>
              <Form />
              <div className='text-xs flex gap-1 flex-col lg:flex-row justify-between w-full mt-auto list-style-disc p-4 lg:px-20'>
                <div className='inline-flex flex-wrap gap-1'>
                  <p>Are you a client? </p>
                  <Link to='/auth/login/client' className='underline inline'>Client Portal</Link>
                </div>
                <Link className='underline' to='/'>Terms & Conditions</Link>
              </div>
            </div>
            <div className=' flex-1/2 overflow-hidden rounded-xl hidden lg:block'>
              <img src="/src/assets/imgs/765.jpg" className='min-h-0 h-full w-full object-cover object-center' alt="" />
            </div>
        </div>
    </div>
  )
}

export default LoginAgentPage