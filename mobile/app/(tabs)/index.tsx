import React, { useState } from "react";
import Login from "./login"; // Import Login Component
import TermsScreen from "./terms";

const TabsLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulated auth state

    // If the user is not logged in, show the login screen
    if (!isAuthenticated) {
        return (
            <Login setLogin={(value: boolean) => setIsAuthenticated(value)} />
        );
    }

    // Otherwise, show the tab navigation
    return <TermsScreen />;
};

export default TabsLayout;
