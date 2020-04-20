import React from 'react'
import { Form, Modal, Input, Button, FormField, ListItem } from 'semantic-ui-react'
import { Formik } from 'formik';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

function AddChannelModal({ open, onClose, teamId }) {

    const createChannelQuery = gql`
        mutation($teamId: Int!, $name: String!) {
            createChannel(teamId: $teamId, name: $name)
        }`;

    const [createChannel] = useMutation(createChannelQuery);

    return (
        <Formik
            initialValues={{ name: "" }}
            onSubmit={async (values) => {
                console.log('Submiting....');

                let response;

                try {
                    response = await createChannel({ variables: { teamId: teamId, name: values.name } });
                } catch (error) {
                    console.log(error);
                    return;
                }

                const { ok, errors, team } = response.data.createChannel;

                console.log(response);

                console.log(values, teamId);

                onClose();
            }}
        >
            {props => {
                const {
                    values,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                } = props;
                return (
                    <Modal open={open} onClose={onClose}>
                        <Modal.Header>Add Channel</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <Form>
                                    <FormField>
                                        <Input
                                            name="name"
                                            value={values.name}
                                            onClose={onClose}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onReset={handleReset}
                                            fluid
                                            placeholder="Channel name"
                                        />
                                    </FormField>
                                </Form>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button disabled={isSubmitting} onClick={onClose} negative>Cancel</Button>
                            <Button type="button" disabled={isSubmitting} onClick={handleSubmit} positive >Create Channel</Button>
                        </Modal.Actions>
                    </Modal>
                );
            }}
        </Formik>
    );
}

export default AddChannelModal;