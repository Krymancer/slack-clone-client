import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react'





function Login({ history }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inputErrors, setInputErrors] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [errorsList, setErrorsList] = useState([]);

    const registerQuery = gql`
        mutation($email: String!, $password: String!) {
            login(email: $email, password: $password) {
            ok
            token
            refreshToken
            errors {
                path
                message
            }
            }
        }`;

    const [login] = useMutation(registerQuery);


    async function handleSubmit() {
        const response = await login({ variables: { email, password } });

        const { ok, errors, token, refreshToken } = response.data.login;

        if (ok) {
            localStorage.setItem('token',token);
            localStorage.setItem('refreshToken',refreshToken);
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

    function handleRegister() {
        history.push('/register');
    }

    return (
        <Container style={{ position: 'relative', top: 30 }} text >
            <Header as='h2' className="loginText">Login</Header>
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

            <Button style={{ marginBottom: 10 }} onClick={handleSubmit} positive fluid>Login</Button>
            <Button className="loginButton" onClick={handleRegister} fluid>Register</Button>

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

export default Login;