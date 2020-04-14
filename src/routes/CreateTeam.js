import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Container, Header, Input, Button, Message, Form, FormField } from 'semantic-ui-react'

function CreateTeam({ history }) {

    const [name, setName] = useState('');

    const [inputErrors, setInputErrors] = useState({ name: '', });

    const createTeamQuery = gql`
        mutation($name: String!) {
            createTeam(name: $name) {
                ok
                errors {
                    path
                    message
                }
            }
        }`;

    const [createTeam] = useMutation(createTeamQuery);

    async function handleSubmit() {

        let response;

        try {
            response = await createTeam({ variables: { name, } });
        } catch (error) {
            history.push('/login');
            return;
        }


        console.log(response);


        const { ok, errors } = response.data.createTeam;

        if (ok) {
            history.push('/');
        } else {
            let err = {};

            if (errors) {
                errors.forEach(e => {
                    err[e.path] = e.message;
                });
            } else {
                err['token'] = 'You must be loged to perform this action';
            }

            setInputErrors(err);
        }
    }

    return (
        <Container style={{ position: 'relative', top: 30 }} text >
            <Header as='h2'>Create a team</Header>
            <Form>
                <FormField error={!!inputErrors.name} >
                    <Input
                        onChange={event => {
                            setName(event.target.value);
                            inputErrors.name = '';
                        }}
                        placeholder='Name'
                        fluid />
                </FormField>
                <Button onClick={handleSubmit} positive fluid>Create</Button>
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

export default CreateTeam;