import {motion, Variants} from 'framer-motion'
import React from 'react';

interface LoaderProps {
    size?: number;
    width?: number;
    color?: string;
    speed?: number;
    thickness?: number;
    className?: string;
}

const TechnoLoader: React.FC<LoaderProps> = ({
    size = 24,
    width = 5,
    color = '#000000',
    speed = 1,
    className = "absolute top-1/2 left-1/2 -translate-1/2",
})=>{

    const loaderVariants: Variants = {
        animationRight: {
            translateX: 20,
            transition: {
                duration: speed,
                repeat: Infinity,
                ease: 'linear'
            }
        },
        animationLeft: {
            translateX: -20,
            transition: {
                duration: speed,
                repeat: Infinity,
                ease: 'linear'
            }
        },
        animationRight2: {
            translateX: 20,
            transition: {
                delay: .03,                
                duration: speed,
                repeat: Infinity,
                ease: 'linear'
            }
        },
        animationLeft2: {
            translateX: -20,
            transition: {
                delay: .03,                
                duration: speed,
                repeat: Infinity,
                ease: 'linear'
            }
        },
        animationRight3: {
            translateX: 20,
            transition: {
                delay: .06,                
                duration: speed,
                repeat: Infinity,
                ease: 'linear'
            }
        },
        animationLeft3: {
            translateX: -20,
            transition: {
                delay: .06,                
                duration: speed,
                repeat: Infinity,
                ease: 'linear'
            }
        },
    }

    return(
        <motion.div className='relative'>
            <motion.div className={className}
            style={{
                width,
                height: 60,
                background: `#44dd55`,
                borderRadius: "4px"
            }}
            variants={loaderVariants}
            animate="animationLeft"
            />
            <motion.div className={className}
            style={{
                width,
                height: 60,
                background: `#44dd55`,
                borderRadius: "4px"
            }}
            variants={loaderVariants}
            animate="animationRight"
            />
            <motion.div className={className}
            style={{
                width,
                height: 60,
                background: `#44dd55`,
                borderRadius: "4px"
            }}
            variants={loaderVariants}
            animate="animationLeft2"
            />
            <motion.div className={className}
            style={{
                width,
                height: 60,
                background: `#44dd55`,
                borderRadius: "4px"
            }}
            variants={loaderVariants}
            animate="animationRight2"
            />
            <motion.div className={className}
            style={{
                width,
                height: 60,
                background: `#44dd55`,
                borderRadius: "4px"
            }}
            variants={loaderVariants}
            animate="animationLeft3"
            />
            <motion.div className={className}
            style={{
                width,
                height: 60,
                background: `#44dd55`,
                borderRadius: "4px"
            }}
            variants={loaderVariants}
            animate="animationRight3"
            />
        </motion.div> 
    )
}

export default TechnoLoader