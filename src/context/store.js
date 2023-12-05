'use client';

import { createContext, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState("")

    const updateUserData = (data) => {
        setUserData(data)
    }

    return (
        <UserContext.Provider value={{ userData, updateUserData }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext

