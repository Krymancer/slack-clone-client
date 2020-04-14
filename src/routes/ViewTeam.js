import React from 'react';

import Teams from '../components/Teams';
import Channels from '../components/Channels';
import Header from '../components/Header';
import Messages from '../components/Messages';
import Input from '../components/Input';
import AppLayout from '../components/AppLayout';


function ViewTeam() {
    return (
        <AppLayout>
            <Teams>Teams</Teams>
            <Channels>Channels</Channels>
            <Header>Header</Header>
            <Messages>
                <ul class="message-list">
                    <li></li>
                    <li></li>
                </ul>
            </Messages>
            <Input>
                <input type="text" placeholder="Enter text" />
            </Input>
        </AppLayout>
    );
}

export default ViewTeam;