import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function useAppContext() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const [isAccountPublic, setIsAccountPublic] = useState(false);
    const [language, setLanguage] = useState('日本語');
    // notification settings state
    const [withFovriteNotification, setWithFovriteNotification] = useState(false);
    const [withCommnetNotification, setWithCommnetNotification] = useState(false);
    const [withWorkoutNotification, setWithWorkoutNotification] = useState(false);
    const [withRunningGroupNotification, setWithRunningGroupNotification] = useState(false);
    const [withRaceNotification, setWithRaceNotification] = useState(false);
    const [withFollowerActivityNotification, setWithFollowerActivityNotification] = useState(false);
    const [withFollowerActivityNotificationF, setWithFollowerActivityNotificationF] = useState(false);
    const [withShoesNotification, setWithShoesNotification] = useState(false);
    const [withCharrengeNotification, setWithCharrengeNotification] = useState(false);
    const [withMotivationNotification, setWithMotivationNotification] = useState(false);

    const value = {
        language, setLanguage,
    }
    return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    );
}
