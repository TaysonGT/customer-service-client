import {IUser} from '../../types/types'
import { useParams } from 'react-router';
import { FormEvent, useEffect, useState } from 'react';
import { createAxiosAuthInstance } from '../../services/axiosAuth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { RiEdit2Fill } from 'react-icons/ri';
import { Avatar, Button, Modal } from '../../components/ui';
import { formatDate } from '../../utils/time';
import { FaCheckCircle, FaCrown, FaHourglassHalf, FaPauseCircle } from 'react-icons/fa';
import supabase from '../../lib/supabase';

const ProfilePage = () => {
  const {userId} = useParams<{userId: string}>()
  const [user, setUser] = useState<IUser>()
  const [isLoading, setIsLoading] = useState(true)
  const [passwordForm, setPasswordForm] = useState({oldPassword: '', newPassword: '', confirmPassword: ''})
  const [showChangePassword, setShowChangePassword] = useState(false)
  const api = createAxiosAuthInstance()
  const {currentUser} = useAuth()

  const refetch = async()=>{
    setIsLoading(true)
    await api.get(`/clients/${userId}`)
    .then(({data})=> {
      if(!data.success) return toast.error(data.message)
      setUser(data.client)
    }).finally(()=>setIsLoading(false))
  }

  const handleChangePassword = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const {error: checkError} = await supabase.auth.signInWithPassword({
      email: currentUser?.email||'',
      password: passwordForm.oldPassword
    })
    if(checkError) return toast.error('Incorrect Password')
    if(passwordForm.newPassword.trim() !== passwordForm.confirmPassword.trim()) return toast.error("New Password and Confirm do not match")
        
    const {error: updateError} = await supabase.auth.updateUser({password: passwordForm.newPassword})
    if(updateError) return toast.error(updateError.message)

    toast.success('Password Changed Successfully!')
    setShowChangePassword(false)
  }

  useEffect(()=>{
    refetch()
  },[userId])

  return (
    <div className="h-full w-full bg-gray-50 py-8 overflow-y-auto">
      {currentUser?.id===user?.id&& showChangePassword&&
        <Modal onClose={()=>setShowChangePassword(false)} isOpen={showChangePassword} title='Change Password'>
          <form onSubmit={handleChangePassword}>
            <label className="pl-1 text-xs font-medium text-gray-800 block">Old Password</label>
            <input onChange={(e)=>setPasswordForm(prev=> ({...prev, oldPassword: e.target.value}))} required className='w-full px-2 py-1 mb-4 border rounded-md border-gray-300' type="password" />
            <label className="pl-1 text-xs font-medium text-gray-800 block">New Password</label>
            <input onChange={(e)=>setPasswordForm(prev=> ({...prev, newPassword: e.target.value}))} required className='w-full px-2 py-1 mb-4 border rounded-md border-gray-300' type="password" />
            <label className="pl-1 text-xs font-medium text-gray-800 block">Confirm New Password</label>
            <input onChange={(e)=>setPasswordForm(prev=> ({...prev, confirmPassword: e.target.value}))} required className='w-full px-2 py-1 mb-4 border rounded-md border-gray-300' type="password" />
            <div className='flex items-center w-full gap-3 mt-2'>
              <Button
                size='sm'
                type='button'
                variant='outline'
                className='flex-1'
                onClick={()=>setShowChangePassword(false)}
              >
                Cancel
              </Button>
              <Button
                size='sm'
                variant='primary'
                className='flex-1'
                type='submit'
                
                >
                Change
              </Button>
            </div>
          </form>
        </Modal>
      }
      {isLoading?
        <div className='h-full w-full flex justify-center items-center'>
          <Loader size={30} thickness={6} />
        </div>
      :!user?
        <div className='h-full w-full flex justify-center items-center'>
          <p className='text-gray-600 text-sm'>User not found</p>
        </div>
      :
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r relative from-blue-600 to-indigo-800 rounded-2xl shadow-xl p-8 text-center text-white mb-8">
          {currentUser?.id === user.id&&
            <span onClick={()=>setShowChangePassword(true)} className='absolute select-none hover:bg-white hover:text-indigo-800 duration-75 text-white font-semibold top-6 right-6 px-4 py-1 rounded-2xl flex items-center gap-2 border border-white'>
              <RiEdit2Fill/> Change Password
            </span>
          }
          <div className="w-32 h-32 rounded-full border-4 border-white/30 bg-white flex items-center justify-center mx-auto mb-6">
            <Avatar
              src={user.avatarUrl} 
              alt={user.username} 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-4 justify-center">
            {user.firstname} {user.lastname}             
            {user.clientProfile?.status && (
              <span className={`flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-sm font-semibold ${
                user.clientProfile.status === 'active' ? 'text-green-300' :
                user.clientProfile.status === 'vip' ? 'text-yellow-300' :
                user.clientProfile.status === 'inactive' ? 'text-red-300' : 'text-blue-300'
              }`}>
                {user.clientProfile.status === 'active' ? <FaCheckCircle />
                :user.clientProfile.status === 'vip' ? <FaCrown />
                :user.clientProfile.status === 'inactive' ? <FaPauseCircle /> : <FaHourglassHalf />}
                {user.clientProfile.status.charAt(0).toUpperCase() + user.clientProfile.status.slice(1)}
              </span>
            )}
          </h1>
          
          <p className="text-lg opacity-90 mb-4">
            {user.clientProfile?.jobTitle} {user.clientProfile?.company && `at ${user.clientProfile.company}`}
          </p>
          
          <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="text-white/80">
              Last seen: {formatDate(user.lastSeenAt, {withTime: true})}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                {currentUser?.role!=='client'&&
                  <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
                    <RiEdit2Fill className="fas fa-edit mr-2"/> Edit
                  </button>
                }
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Username</label>
                  <p className="text-gray-800">@{user.username}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                  <p className="text-gray-800">{user.firstname} {user.lastname}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                  <p className="text-gray-800">{user.phone}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Gender</label>
                  <p className="text-gray-800 capitalize">{user.gender}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Client Type</label>
                  <p className="text-gray-800 capitalize">{user.clientProfile?.clientType || 'N/A'}</p>
                </div>
              </div>
              
              {user.description && (
                <div className="mt-6">
                  <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                  <p className="text-gray-800 mt-1">{user.description}</p>
                </div>
              )}
            </div>

            {/* Professional Information Card */}
            {user.clientProfile && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
                  {currentUser?.role!=='client'&&
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
                      <RiEdit2Fill className="fas fa-edit mr-2"/> Edit
                    </button>
                  }
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.clientProfile.company && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Company</label>
                      <p className="text-gray-800">{user.clientProfile.company}</p>
                    </div>
                  )}
                  
                  {user.clientProfile.jobTitle && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Job Title</label>
                      <p className="text-gray-800">{user.clientProfile.jobTitle}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Client Type</label>
                    <p className="text-gray-800 capitalize">{user.clientProfile.clientType || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.clientProfile.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.clientProfile.status === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                      user.clientProfile.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.clientProfile.status ? user.clientProfile.status.charAt(0).toUpperCase() + user.clientProfile.status.slice(1) : 'N/A'}
                    </span>
                  </div>
                  
                  {user.clientProfile.leadSource && (
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-500 uppercase">Lead Source</label>
                      <p className="text-gray-800">{user.clientProfile.leadSource}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Address Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Address</h2>
                  {currentUser?.role!=='client'&&
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
                      <RiEdit2Fill className="fas fa-edit mr-2"/> Edit
                    </button>
                  }
                </div>
                
                <div className="space-y-2">
                  {user.clientProfile?.address?
                  <>
                    {user.clientProfile.address.street && (
                      <div className=''>
                        <label className="text-xs font-medium text-gray-500 uppercase">Street</label>
                        <p className="text-gray-800">{user.clientProfile.address.street}</p>
                      </div>
                    )}
                  
                    {user.clientProfile.address.city && user.clientProfile.address.state && (
                      <div className=''>
                        <label className="text-xs font-medium text-gray-500 uppercase">City</label>
                        <p className="text-gray-800">
                          {user.clientProfile.address.city}, {user.clientProfile.address.state} {user.clientProfile.address.postalCode}
                        </p>
                      </div>
                    )}
                    
                    {user.clientProfile.address.country && (
                      <div className=''>
                        <label className="text-xs font-medium text-gray-500 uppercase">Country</label>
                        <p className="text-gray-800">{user.clientProfile.address.country}</p>
                      </div>
                      )}
                    </>
                  :
                    <p className="text-gray-800">No address provided for user.</p>
                  }
                  </div>
              </div>

            {/* Social Profiles Card */}
            {user.clientProfile?.socialProfiles && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Social Profiles</h2>
                
                <div className="flex space-x-4">
                  {user.clientProfile.socialProfiles.twitter && (
                    <a href={user.clientProfile.socialProfiles.twitter} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-twitter hover:text-white transition-colors">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  
                  {user.clientProfile.socialProfiles.linkedin && (
                    <a href={user.clientProfile.socialProfiles.linkedin} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-linkedin hover:text-white transition-colors">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  
                  {user.clientProfile.socialProfiles.facebook && (
                    <a href={user.clientProfile.socialProfiles.facebook} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-facebook hover:text-white transition-colors">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  
                  {user.clientProfile.socialProfiles.instagram && (
                    <a href={user.clientProfile.socialProfiles.instagram} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-instagram hover:text-white transition-colors">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Preferences Card */}
            {user.clientProfile?.preferences && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
                  {currentUser?.role!=='client'&&
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
                      <RiEdit2Fill className="fas fa-edit mr-2"/> Edit
                    </button>
                  }
                </div>
                
                <div className="space-y-4">
                  {user.clientProfile.preferences.timezone && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-indigo-600 mr-3">
                        <i className="fas fa-globe"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Timezone</p>
                        <p className="text-gray-800">{user.clientProfile.preferences.timezone}</p>
                      </div>
                    </div>
                  )}
                  
                  {user.clientProfile.preferences.language && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-indigo-600 mr-3">
                        <i className="fas fa-language"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Language</p>
                        <p className="text-gray-800">{user.clientProfile.preferences.language}</p>
                      </div>
                    </div>
                  )}
                  
                  {user.clientProfile.preferences.contactMethod && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-indigo-600 mr-3">
                        <i className="fas fa-comments"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preferred Contact</p>
                        <p className="text-gray-800 capitalize">{user.clientProfile.preferences.contactMethod}</p>
                      </div>
                    </div>
                  )}
                  
                  {user.clientProfile.preferences.notificationPreferences && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Notification Preferences</p>
                      <div className="flex flex-wrap gap-2">
                        {user.clientProfile.preferences.notificationPreferences.marketing && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <i className="fas fa-check-circle mr-1"></i> Marketing
                          </span>
                        )}
                        {user.clientProfile.preferences.notificationPreferences.productUpdates && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <i className="fas fa-check-circle mr-1"></i> Product Updates
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default ProfilePage