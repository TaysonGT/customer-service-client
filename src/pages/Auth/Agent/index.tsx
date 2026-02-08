import { Link } from 'react-router'
import Form from './Form'

const LoginAgentPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[url(/src/assets/imgs/login-bg.webp)] bg-cover bg-center">
      <div className='flex bg-linear-to-tl from-cyan-300 to-[#ffb1fb] lg:h-[90%] lg:w-300 rounded-sm shadow-hover overflow-hidden'>
        <div className='flex flex-1/2 flex-col justify-center items-center text-main overflow-hidden p-10'>
          {/* <p className='text-2xl shadow-black/10 text-cyan-950 py-6 px-10 w-full space-x-2 font-bold'><span>Support Portal</span> <span className='font-normal'>|</span>  <span className='font-normal'>Login</span></p> */}
          <p className='text-2xl shadow-black/10 text-cyan-950 inline-block self-start space-x-2 px-8 py-3 border-2 rounded-lg border-cyan-950'><span>Support Portal</span> <span className='font-extralight'>|</span>  <span className='font-light'>Login</span></p>
          <Form />
          <div className='text-xs flex gap-1 flex-col lg:flex-row justify-between w-full mt-auto list-style-disc pt-10'>
            <div className='inline-flex flex-wrap gap-1'>
              <p>Are you a client? </p>
              <Link to='/auth/login/client' className='underline inline'>Client Portal</Link>
            </div>
            <Link className='underline' to='/'>Terms & Conditions</Link>
          </div>
        </div>
        <div className='flex-1/2 overflow-hidden hidden lg:block'>
          <img src="/src/assets/imgs/765.jpg" className='min-h-0 h-full w-full object-cover object-center' alt="" />
        </div>
      </div>
    </div>
  )
}

export default LoginAgentPage