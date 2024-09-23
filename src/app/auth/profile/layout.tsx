import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const ProfileLayout = ({children} : { children : React.ReactNode}) => {
    return ( 
        <SessionProviderWrapper>
            {children}
        </SessionProviderWrapper>
     );
}
 
export default ProfileLayout;