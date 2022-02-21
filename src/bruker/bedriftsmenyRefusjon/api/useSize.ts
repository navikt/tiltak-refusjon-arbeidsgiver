import { Dispatch, SetStateAction, useEffect } from 'react';

interface Properties {
    desktopview: boolean;
    setDesktopview: Dispatch<SetStateAction<boolean>>;
}

const useSize = (props: Properties) => {
    const { desktopview, setDesktopview } = props;

    useEffect(() => {
        const sjekkWindowSize = () => {
            if (window.innerWidth > 768 && !desktopview) {
                setDesktopview(true);
            } else if (window.innerWidth < 768 && desktopview) {
                setDesktopview(false);
            }
        };
        window.addEventListener('resize', sjekkWindowSize);
        return () => window.removeEventListener('resize', sjekkWindowSize);
    }, [desktopview, setDesktopview]);
};
export default useSize;
