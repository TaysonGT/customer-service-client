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
    await loginUser(data.username, data.password, 'client')
      .then(() => {
        nav('/'); // Redirect to home on successful login
      })
      .catch((error) => {
        setIsSubmitting(false);
        setFormError(error.message || 'Login failed. Please try again.');  
      })
    };

  // Check if any field has error
  const hasFieldError = errors.username || errors.password;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 relative">
      {/* Single error message box */}
      {(formError || hasFieldError) && (
        <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{formError || 'Please fill all required fields'}</p>
        </div>
      )}

      <label className='text-lg'>Username</label>
      <div className='relative mt-2'>
        <input 
          {...register('username')} 
          placeholder="Enter your username" 
          className={`w-full bg-white placeholder:text-gray-400 rounded p-2 peer-autofill:bg-white ${
            errors.username ? 'border-red-500 bg-red-50' : ''
          }`}
        />
      </div>
      
      <label className='text-lg'>Password</label>
      <div className='relative mt-2'>
        <input 
          {...register('password')} 
          type="password" 
          placeholder="Enter your password" 
          className={`w-full bg-white placeholder:text-gray-400 rounded p-2 ${
            errors.password ? 'border-red-500 bg-red-50' : ''
          }`}
        />
      </div>
      
      <div className='flex items-center gap-1 text-sm text-gray-700'>
        <input {...register('remember')} type='checkbox'/>
        <p>Remember Me</p>
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-[#6ea6ff] disabled:bg-transparent border border-accent hover:border-[#6ea6ff] disabled:text-primary-text disabled:border-primary-text duration-150 cursor-pointer text-white py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default Form