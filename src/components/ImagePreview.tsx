import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import { IoClose } from 'react-icons/io5'
import Loader from './Loader'

const ImagePreview = ({src, alt, show, onClose, type}:{src: string, alt: string, show: boolean, onClose: ()=>void, type: 'chat'|'ticket_attachment'}) => {
    const [url,setUrl] = useState<string|null>(null)
    const [loading,setLoading] = useState(true)
    
    useEffect(()=>{
        const getUrl = async()=> {
            setLoading(true)
            const {data:url} = await supabase.storage
            .from('ticket_attachments')
            .createSignedUrl(src, 3600)
            
            setUrl(type==='ticket_attachment'?url?.signedUrl || '#': src)
            setLoading(false)
        }
        getUrl()
    },[])
  return (
    <div className={`w-screen h-screen fixed top-0 left-0 p-6 flex flex-col items-center z-200 duration-200 ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div onClick={onClose} className='bg-black/60 w-full h-full absolute top-0 left-0 z-1'/>
        <div className='relative border-gray-700 rounded-sm h-full w-full border bg-white z-2 flex justify-center items-center'>
            <IoClose onClick={onClose} className='absolute right-4 top-4 text-red-500 hover:text-red-400 cursor-pointer text-xl'/>
            {loading?
                <Loader size={40} thickness={6} />
                :
                <img src={url||'#'} alt={alt} className='w-full h-full object-contain'/>
            }
        </div>
    </div>
  )
}

export default ImagePreview