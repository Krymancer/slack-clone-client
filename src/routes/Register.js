import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react'


function Register({ history }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inputErrors, setInputErrors] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [errorsList, setErrorsList] = useState([]);

    const registerQuery = gql`
        mutation($username: String!, $email: String!, $password: String!) {
            register(username: $username, email: $email, password: $password) {
                ok
                errors{
                path,
                message
                }
            }
        }`;

    const [register] = useMutation(registerQuery);

    async function handleSubmit() {

        const response = await register({ variables: { username, email, password } });

        const { ok, errors } = response.data.register;

        if (ok) {
            history.push('/');
        } else {
            let err = {};
            let list = [];
            errors.forEach(e => {
                err[e.path] = e.message;
                list.push(e.message);
            });

            setInputErrors(err);
            setErrorsList(list);
        }
    }

    return (
        <Container style={{ position: 'relative', top: 30 }} text>
            <Header as='h2'>Register</Header>
            <Input
                style={
                    { marginTop: 10, marginBottom: 10 }
                }
                error={!!inputErrors.username}
                onChange={event => {
                    setUsername(event.target.value);
                    inputErrors.username = '';
                }}
                placeholder='Username'
                fluid
            />
            <Input
                style={
                    { marginTop: 10, marginBottom: 10 }
                }
                error={!!inputErrors.email}
                onChange={event => {
                    setEmail(event.target.value);
                    inputErrors.email = '';
                }}
                placeholder='Email'
                fluid />
            <Input
                style={
                    { marginTop: 10, marginBottom: 10 }
                }
                error={!!inputErrors.password}
                onChange={event => {
                    setPassword(event.target.value);
                    inputErrors.password = '';
                }}
                type="password"
                placeholder='Passowrd'
                fluid />
            
            <Button style={{marginBottom: 10}} onClick={handleSubmit} positive fluid>Submit</Button>
            {/* <Button negative fluid>Cancel</Button> */}

            {(inputErrors.username || inputErrors.email || inputErrors.password) ?
                <Message
                    error
                    header='There was some errors with your submission'
                    list={errorsList}
                />
                : null
            }

        </Container>
    );
}

export default Register;
