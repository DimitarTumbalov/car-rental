
import { Navigate } from "react-router-dom";
import { getLoggedUser } from "../http-utils/user-requests";

export function AuthorizedGuard({ children }) {
    const user = getLoggedUser();

    if (user.role != 'admin') {
        return <Navigate to='/vehicles' />;
    }

    return children;
}