import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Container, Header, Input, Button, Message, Form, FormField } from 'semantic-ui-react'

function Login({ history }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inputErrors, setInputErrors] = useState({
        username: '',
        email: '',
        password: '',
    });

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
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            history.push('/');
        } else {
            let err = {};

            errors.forEach(e => {
                err[e.path] = e.message;
            });

            setInputErrors(err);
        }
    }

    function handleRegister() {
        history.push('/register');
    }

    return (
        <Container style={{ position: 'relative', top: 30 }} text >
            <Header as='h2'>Login</Header>
            <Form>
                <FormField error={!!inputErrors.email} >
                    <Input
                        onChange={event => {
                            setEmail(event.target.value);
                            inputErrors.email = '';
                        }}
                        placeholder='Email'
                        fluid />
                </FormField>
                <FormField error={!!inputErrors.password}>
                    <Input
                        onChange={event => {
                            setPassword(event.target.value);
                            inputErrors.password = '';
                        }}
                        type="password"
                        placeholder='Passowrd'
                        fluid />
                </FormField>
                <Button style={{ marginBottom: 10 }} onClick={handleSubmit} positive fluid>Login</Button>
                <Button className="loginButton" onClick={handleRegister} fluid>Register</Button>
            </Form>

            {(Object.values(inputErrors).some(x => x !== '' && x !== null)) ?
                <Message
                    error
                    header='There was some errors with your submission'
                    list={Object.values(inputErrors)}
                />
                : null
            }

        </Container>
    );
}

export default Login;