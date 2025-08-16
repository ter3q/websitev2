export default function Pagecontact() {
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
        <>
            <h1
                ref={ref}
                className={cn(
                    "transition-all duration-1000",
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 "
                )}
            >
                <div className=''>
                    <p style={{ color: '#ffffffff' }} className='text-center text-6xl font-bold my-35'>Contact</p>
                </div>
            </h1>

            <div className="flex justify-center gap-8">
                <a href="https://github.com/ter3q" className="w-60 h-40 flex flex-col justify-between p-6 border border-[#f8cbfe] rounded-lg shadow-md bg-[#f8cbfe] hover:bg-[#f0b3f6] dark:bg-[#f8cbfe] dark:hover:bg-[#e8a9ed] dark:border-[#f8cbfe]">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Github</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">https://github.com/ter3q</p>
                </a>

                <a href="mailto:contact@ter3q.comq" className="w-60 h-40 flex flex-col justify-between p-6 border border-[#f8cbfe] rounded-lg shadow-md bg-[#f8cbfe] hover:bg-[#f0b3f6] dark:bg-[#f8cbfe] dark:hover:bg-[#e8a9ed] dark:border-[#f8cbfe]">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Email</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">contact@ter3q.com</p>
                </a>
            </div>

        </>
    );
};
