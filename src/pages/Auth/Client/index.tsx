import Form from './Form'

const LoginClientPage = () => {
  return ( 
    <div className="w-screen h-screen flex justify-center items-center bg-[url(/src/assets/imgs/login-bg.webp)] bg-cover bg-center">
        <div className='flex bg-white lg:h-[80%] md:w-[66%] xl:w-[1024px] rounded-md shadow-hover'>
            <div className='flex flex-1/2 flex-col gap-6 justify-center p-10 xl:p-20 items-left text-main bg-[linear-gradient(70deg,#E4E6E8,#FEEBAF)]'>
                <h1 className='text-2xl lg:text-3xl font-semibold'>Sign in</h1>
                <Form />
            </div>
            <div className='flex-1/2 sm overflow-hidden hidden flex-col justify-center items-center bg-main text-background lg:flex p-10'>
                <h1 className='font-bold xl:text-3xl text-2xl'>Customer Service</h1>
                <p className='flex gap-2 items-center'>We're here for you <span className='text-secondary-accent text-xl font-bold'>24/7</span></p>
                <img src="/src/assets/imgs/login.png" className='min-h-0' alt="" />
            </div>
        </div>
    </div>
  )
}

export default LoginClientPage