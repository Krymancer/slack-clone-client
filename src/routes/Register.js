import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Container, Header, Input, Button, Message, Form } from 'semantic-ui-react'


function Register({ history }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inputErrors, setInputErrors] = useState({
        username: '',
        email: '',
        password: '',
    });

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

            errors.forEach(e => {
                err[e.path] = e.message;
            });

            setInputErrors(err);
        }
    }

    return (
        <Container style={{ position: 'relative', top: 30 }} text>
            <Header as='h2'>Register</Header>
            <Form>
                <Form.Field error={!!inputErrors.username} >
                    <Input
                        onChange={event => {
                            setUsername(event.target.value);
                            inputErrors.username = '';
                        }}
                        placeholder='Username'
                        fluid
                    />
                </Form.Field>
                <Form.Field error={!!inputErrors.email} >
                    <Input
                        onChange={event => {
                            setEmail(event.target.value);
                            inputErrors.email = '';
                        }}
                        placeholder='Email'
                        fluid />
                </Form.Field>
                <Form.Field error={!!inputErrors.password} >
                    <Input
                        onChange={event => {
                            setPassword(event.target.value);
                            inputErrors.password = '';
                        }}
                        type="password"
                        placeholder='Passowrd'
                        fluid />
                </Form.Field>

                <Button onClick={handleSubmit} positive fluid>Submit</Button>
                {/* <Button negative fluid>Cancel</Button> */}
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

export default Register;
