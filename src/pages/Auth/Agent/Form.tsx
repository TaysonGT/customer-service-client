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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full grow relative flex flex-col justify-center pb-4 px-10 lg:pb-10 xl:px-20">
        <h1 className='text-2xl lg:text-3xl text-center font-bold mb-8'>Support Agent Portal</h1>
      {(formError || hasFieldError) && (
        <div className="mb-4 p-2 px-4  animate-appear border-red-500 border-x-2 bg-red-100 text-red-700 absolute bottom-full left-1/2 -translate-x-1/2">
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
      <div className='flex items-center gap-1 lg:pl-4 mb-2 text-sm text-gray-700'>
        <input {...register('remember')} type='checkbox'/>
        <p>Remember Me</p>
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full text-sm bg-accent hover:bg-[#6ea6ff] disabled:bg-[#b7d2ff] duration-150 cursor-pointer text-white p-2 lg:p-3 rounded lg:rounded-4xl disabled:opacity-50"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default Form