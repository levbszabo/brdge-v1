import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants
const animations = {
    fadeInUp: {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1] // Cubic bezier for smooth animation
            }
        }
    },
    fadeIn: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut'
            }
        }
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    },
    slideInLeft: {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    },
    slideInRight: {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    }
};

const AnimatedContainer = ({
    children,
    animation = 'fadeInUp',
    delay = 0,
    threshold = 0.1,
    triggerOnce = true,
    stagger = false,
    staggerDelay = 0.1,
    ...props
}) => {
    const [ref, inView] = useInView({
        threshold,
        triggerOnce
    });

    const selectedAnimation = animations[animation] || animations.fadeInUp;

    const containerVariants = stagger ? {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay
            }
        }
    } : {
        ...selectedAnimation,
        visible: {
            ...selectedAnimation.visible,
            transition: {
                ...selectedAnimation.visible.transition,
                delay
            }
        }
    };

    return (
        <Box
            ref={ref}
            component={motion.div}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
            {...props}
        >
            {children}
        </Box>
    );
};

export default AnimatedContainer; 