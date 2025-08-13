import React from 'react'

interface Props {
    cancel: ()=> void
    show: boolean
}

const DarkBackground:React.FC<Props> = ({cancel, show})=>{
    return (
        <div 
            className={`w-screen h-screen fixed right-full top-0 z-[99] bg-black opacity-0 duration-300 ${show&& 'translate-x-full opacity-30'}`} 
            onClick={()=>cancel()}
        />
    )
}

export default DarkBackground