import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IUser} from '../../types/types';
import countryCodes from '../../assets/CountryCodes.json';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export type IUserPayload = Omit<IUser, 'id'|'role'|'categoryId'|'supportId'|'last_seen_at'>

const getSchema = (countryCode: string) => z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email address'),
  gender: z.string().min(1, 'Gender is required'),
  description: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  phone: z.string().min(1, 'Please type your phone number').refine((value) => {
    try {
      const number = phoneUtil.parse(value, countryCode);
      return phoneUtil.isValidNumberForRegion(number, countryCode);
    } catch {
      return false;
    }
  }, { message: 'Invalid phone number for selected country' }),
  countryCode: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  clientType: z.enum(['individual', 'business']).optional(),
  status: z.enum(['prospect', 'active', 'inactive', 'vip']).optional(),
  leadSource: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  socialProfiles: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
  }).optional(),
  preferences: z.object({
    timezone: z.string().optional(),
    language: z.string().optional(),
    contactMethod: z.enum(['email', 'phone', 'sms', 'whatsapp']).optional(),
    notificationPreferences: z.object({
      marketing: z.boolean().optional(),
      productUpdates: z.boolean().optional(),
    }).optional(),
  }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type NewUserFormData = z.infer<ReturnType<typeof getSchema>>;

interface NewClientFormProps {
  onSubmit: (data: IUserPayload) => void;
  onCancel: () => void;
}

const NewClientForm: React.FC<NewClientFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<NewUserFormData>({
    resolver: (data, context, options) => {
      const country = data.countryCode || 'US';
      return zodResolver(getSchema(country))(data, context, options);
    },
    defaultValues: {
      clientType: 'individual',
      status: 'prospect',
      countryCode: 'EG', 
    },
  });

  const selectedCountry = watch('countryCode');
  const selectedCountryData = countryCodes.find(c => c.code === selectedCountry);
  const dialCode = selectedCountryData?.dial_code || '';

  const handleFormSubmit = (data: NewUserFormData) => {
    const newUser: IUserPayload = {
      ...data,
      phone: dialCode + data.phone,
    };
    onSubmit(newUser);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 h-full">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
            <input
              {...register('firstname')}
              className={`w-full px-3 py-2 border rounded-md ${errors.firstname ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
            <input
              {...register('lastname')}
              className={`w-full px-3 py-2 border rounded-md ${errors.lastname ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
            <select
              {...register('gender')}
              className={`w-full px-3 py-2 border rounded-md ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Account Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
            <input
              {...register('username')}
              className={`w-full px-3 py-2 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
          </div>

           {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
            <div className="flex">
              <select
                {...register('countryCode')}
                className="w-1/3 px-3 py-2 border rounded-l-md border-gray-300"
                defaultValue='EG'
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} ({country.dial_code})
                  </option>
                ))}
              </select>
              <input
                {...register('phone')}
                className={`w-2/3 px-3 py-2 border rounded-r-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

        </div>
      </div>

      {/* Professional Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Business Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              {...register('company')}
              className={`w-full px-3 py-2 border rounded-md ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              {...register('jobTitle')}
              className={`w-full px-3 py-2 border rounded-md ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          {/* Client Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Type</label>
            <select
              {...register('clientType')}
              className={`w-full px-3 py-2 border rounded-md ${errors.clientType ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register('status')}
              className={`w-full px-3 py-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          {/* Lead Source */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
            <input
              {...register('leadSource')}
              className={`w-full px-3 py-2 border rounded-md ${errors.leadSource ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
            <input
              {...register('address.street')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              {...register('address.city')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
            <input
              {...register('address.state')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              {...register('address.postalCode')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              {...register('address.country')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Social Profiles Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Social Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Twitter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
            <input
              {...register('socialProfiles.twitter')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              {...register('socialProfiles.linkedin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
            <input
              {...register('socialProfiles.facebook')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
            <input
              {...register('socialProfiles.instagram')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              {...register('preferences.timezone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select timezone</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              {/* Add more timezones as needed */}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              {...register('preferences.language')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select language</option>
              <option value="ar">Arabic</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              {/* Add more languages as needed */}
            </select>
          </div>
        </div>
      </div>
      <div className="py-3 border-t border-gray-200 flex justify-start gap-3 shrink-0">
        <button
          type='button'
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={handleSubmit(handleFormSubmit)}
        >
          Create Client
        </button>
      </div>
    </form>
  );
};

export default NewClientForm;