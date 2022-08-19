import { Dispatch, SetStateAction, useEffect } from 'react';

interface Properties {
    desktopview: boolean;
    setDesktopview: Dispatch<SetStateAction<boolean>>;
}

const useSize = (props: Properties) => {
    const { desktopview, setDesktopview } = props;

    useEffect(() => {
        const applyWindowSize = () => {
            if (window.innerWidth > 768 && !desktopview) setDesktopview(true);
            else if (window.innerWidth < 768 && desktopview) setDesktopview(false);
        };
        window.addEventListener('resize', applyWindowSize);
        return () => window.removeEventListener('resize', applyWindowSize);
    }, [desktopview, setDesktopview]);
};
export default useSize;
