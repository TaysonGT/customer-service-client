import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';

const getSchema = () =>
  z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    remember: z.boolean()
  })

type LoginFormData = z.infer<ReturnType<typeof getSchema>>;

const Form = () => {
  const [formError, setFormError] = useState<string|null>(null)
  const nav = useNavigate()
  const {loginUser} = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginFormData>({
      resolver: zodResolver(getSchema())
    });

  const onSubmit = async (data: LoginFormData) => {
    setFormError(null); // Clear previous errors
    setIsSubmitting(true)
    await loginUser(data.username, data.password, 'support')
      .then(() => {
        nav('/'); // Redirect to home on successful login
      })
      .catch((error) => {
        setFormError(error.message || 'Login failed. Please try again.');  
        setIsSubmitting(false);
      })
  };

  // Check if any field has error
  const hasFieldError = errors.username || errors.password;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full grow relative flex flex-col justify-center">
        {/* <p className='text-2xl shadow-black/10 text-cyan-950 self-center space-x-2 px-8 py-3 border-2 rounded-2xl border-cyan-950 mb-16'><span>Support Portal</span> <span className='font-extralight'>|</span>  <span className='font-light'>Login</span></p> */}
      {(formError || hasFieldError) && (
        <div className="mb-4 p-2 px-4  animate-appear border-red-500 border-x-2 bg-red-100 text-red-700 absolute top-0 z-50 left-1/2 -translate-x-1/2">
          <p>{formError || 'Please fill all required fields'}!</p>
        </div>
      )}

      <label className='text-sm lg:text-lg text-secondary-text lg:pl-4'>Username</label>
      <div className='relative mt-1 mb-4'>
        <input 
          {...register('username')} 
          placeholder="Enter your username" 
          className={`text-md w-full placeholder:text-gray-400 border py-2 md:py-3 px-6 rounded lg:rounded-3xl border-none bg-white ${
            errors.username ? 'border-red-500 bg-red-50' : ''
          }`}
        />
      </div>
      
      <label className='text-sm lg:text-lg text-secondary-text lg:pl-4'>Password</label>
      <div className='relative mt-1 mb-4'>
        <input 
          {...register('password')} 
          type="password" 
          placeholder="Enter your password" 
          className={`text-md w-full placeholder:text-gray-400 border py-2 md:py-3 px-6 rounded lg:rounded-3xl border-none bg-white ${
            errors.password ? 'border-red-500 bg-red-50' : ''
          }`}
        />
      </div>
      <div className='flex items-center gap-1 lg:pl-4 mb-4 text-sm text-gray-700'>
        <input {...register('remember')} type='checkbox'/>
        <p>Remember Me</p>
      </div>
      
      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full text-sm lg:text-base bg-accent hover:bg-[#6ea6ff] hover:border-[#6ea6ff] disabled:bg-transparent disabled:border-main disabled:text-main border border-accent duration-150 cursor-pointer text-white p-2 lg:p-3 rounded lg:rounded-4xl disabled:opacity-50"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default Form