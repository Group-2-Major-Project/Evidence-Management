import React from 'react';
import { Navigate } from 'react-router';

const Home = (isUserLogin) => {
    return (
        !isUserLogin?
            <Navigate to="/employeelist" replace={true} />
            : <Navigate to="/login" replace={true} />
    );

}

export default Home;