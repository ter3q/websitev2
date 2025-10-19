export default function PageHome() {
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
        <h1>
            <p className='text-center text-5xl font-bold my-35 text-[#fdd6dd]'>色々なノベルゲームをします。</p>
            
        </h1>
    );
};

