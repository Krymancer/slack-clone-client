import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import 'semantic-ui-css/semantic.min.css'

function Home() {

    const allUsersQuery = gql`
        {
            allUsers{
                id,
                email
        }
    }`;

    const { loading, error, data } = useQuery(allUsersQuery);

    if (loading) {
        return (<h1>Loading...</h1>)
    }

    if (error) {
        return (<h1>{error.message}</h1>);
    }

    const {allUsers} = data;

    return (
        <div>
            {
                allUsers.map(u => 
                   (<h1 key={u.id}> {u.email} </h1>)
                )
            }
        </div>
    );
};


export default Home;
