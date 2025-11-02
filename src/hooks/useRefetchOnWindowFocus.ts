import { useEffect } from "react";

type RefetchFunction = () => void | Promise<void>;

const useRefetchOnWindowFocus = (refetch: RefetchFunction): void => {
    useEffect(() => {
        const handleFocus = () => {
            refetch();
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [refetch]);
};

export default useRefetchOnWindowFocus;
