import Header from "../component/Header";




export default function PageError() {
    return (
        <main>
            <Comp />
        </main>
    );
}
//@ts-ignore
import React, { useRef, useState, useEffect } from 'react';

function cn(...classes: (string | undefined | false | null)[]) {
    return classes.filter(Boolean).join(' ');
}
export const Comp = () => {
    const ref = useRef<HTMLHeadingElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (inView) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !inView) {
                setInView(true);
            }
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [inView]);

    return (
        <h1
            ref={ref}
            className={cn(
                "transition-all duration-1000",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 "
            )}
        >   
            <div>
            <Header></Header>
            <p style={{ color: '#e5a9bf' }}className='text-center text-6xl font-bold my-35'>404 Not Found</p>
            </div>
        </h1>
    );
};