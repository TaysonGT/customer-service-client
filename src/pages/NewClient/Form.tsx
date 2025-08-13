import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneNumberUtil } from 'google-libphonenumber';
import countryCodes from '../../assets/CountryCodes.json';

const phoneUtil = PhoneNumberUtil.getInstance();

const getSchema = (countryCode: string) =>
  z.object({
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    username: z.string().min(6, 'Username must be at least 6 characters'),
    gender: z.string().min(1, 'Gender is required'),
    email: z.email('Invalid email address'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
    country: z.string().min(1, 'Please select a country'),
    phone: z.string().min(1, 'Please type your phone number').refine((value) => {
      try {
        const number = phoneUtil.parse(value, countryCode);
        return phoneUtil.isValidNumberForRegion(number, countryCode);
      } catch {
        return false;
      }
    }, { message: 'Invalid phone number for selected country' }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<ReturnType<typeof getSchema>>;

const NewClientForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: (data, context, options) => {
      const country = data.country || 'US';
      return zodResolver(getSchema(country))(data, context, options);
    },
    defaultValues: {
      country: 'EG', 
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log('Form submitted:', data);
  };

  const selectedCountry = watch('country');
  const selectedCountryData = countryCodes.find(c => c.code === selectedCountry);
  const dialCode = selectedCountryData?.dial_code || '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-4 p-4">
      {/* Name Row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input {...register('firstname')} placeholder="First name" className="w-full border px-2 py-1" />
          {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
        </div>
        <div className="flex-1">
          <input {...register('lastname')} placeholder="Last name" className="w-full border px-2 py-1" />
          {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
        </div>
      </div>

      <div className='relative'>
        <select {...register('gender')} className="w-full border px-2 py-1">
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 py-1 px-2 rounded-sm text-sm absolute bg-red-200 left-[calc(100%+10px)] top-0 text-nowrap">{errors.gender.message}</p>}
      </div>
      <div className='relative'>
        <input {...register('email')} placeholder="Email" className="w-full border px-2 py-1" />
        {errors.email && <p className="text-red-500 py-1 px-2 rounded-sm text-sm absolute bg-red-200 left-[calc(100%+10px)] top-0 text-nowrap">{errors.email.message}</p>}
      </div>
      <div className='relative'>
        <textarea {...register('description')} placeholder="Description" className="w-full border px-2 py-1 resize-none" />
        {errors.description && <p className="text-red-500 py-1 px-2 rounded-sm text-sm absolute bg-red-200 left-[calc(100%+10px)] top-0 text-nowrap">{errors.description.message}</p>}
      </div>
      <div className='relative'>
        <input {...register('username')} placeholder="Username" className="w-full border px-2 py-1 "/>
          {errors.username && <p className="text-red-500 py-1 px-2 rounded-sm text-sm absolute bg-red-200 left-[calc(100%+10px)] top-0 text-nowrap">{errors.username.message}</p>}
      </div>
      <div className='relative'>
        {/* Password + Confirm Password */}
        <input {...register('password')} type="password" placeholder="Password" className="w-full border px-2 py-1" />
        {errors.password && <p className="text-red-500 py-1 px-2 rounded-sm text-sm absolute bg-red-200 left-[calc(100%+10px)] top-0 text-nowrap">{errors.password.message}</p>}
      </div>
      <div className='relative'>
        <input {...register('confirmPassword')} type="password" placeholder="Confirm Password" className="w-full border px-2 py-1" />
        {errors.confirmPassword && <p className="text-red-500 py-1 px-2 rounded-sm text-sm absolute bg-red-200 left-[calc(100%+10px)] top-0 text-nowrap">{errors.confirmPassword.message}</p>}
      </div>

      <div className='relative'>
        {/* Country Select */}
        <select {...register('country')} className="w-full border px-2 py-1">
          <option value="">Select country</option>
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {`${country.name} (${country.dial_code})`}
            </option>
          ))}
        </select>
        {errors.country && <p className="text-red-500 py-1 px-2 rounded-sm text-sm absolute bg-red-200 left-[calc(100%+10px)] top-0 text-nowrap">{errors.country.message}</p>}
      </div>



      {/* Phone with Dial Code Inline */}
      <div className="flex gap-2">
        <span className="text-sm px-3 py-1 border rounded min-w-[70px] bg-gray-100 flex items-center justify-center">
          {dialCode}
        </span>
        <div className="flex-1 relative">
          <input {...register('phone')} placeholder="Phone number" className="w-full border px-2 py-1" />
          {errors.phone && <p className="text-red-500 py-1 px-2 rounded-sm text-sm absolute bg-red-200 left-[calc(100%+10px)] top-0 text-nowrap">{errors.phone.message}</p>}
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Register
      </button>
    </form>
  );
};

export default NewClientForm;
