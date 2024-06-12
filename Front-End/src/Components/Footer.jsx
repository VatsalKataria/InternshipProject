import { useState, useEffect, useMemo } from 'react';

const Footer = () => {
    const thoughts = useMemo(() => [
        "Stay Cool, Stay Calm.",
        "Chill Out, Breathe Easy.",
        "Cool Mind, Clear Thoughts.",
        "Keep Calm and Think On.",
        "Tranquility Starts with You.",
        "Relax, Reflect, Rejuvenate.",
        "Find Your Inner Peace.",
        "Breathe Deep, Stay Cool.",
        "Stay Collected, Stay Cool.",
        "Calm Mind, Happy Life."
    ], []);

    const [currentThought, setCurrentThought] = useState(thoughts[0]);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentThought(prevThought => {
                    const currentIndex = thoughts.indexOf(prevThought);
                    const nextIndex = (currentIndex + 1) % thoughts.length;
                    return thoughts[nextIndex];
                });
                setFade(true);
            }, 1000); 
        }, 15000);

        return () => clearInterval(interval);
    }, [thoughts]);

    return (
        <div className="Footer">
            <h4 className={fade ? 'fade-in' : 'fade-out'}>{currentThought}</h4>
        </div>
    );
}

export default Footer;
