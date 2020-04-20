import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import decode from 'jwt-decode';
import { findIndex } from 'lodash';

import {allTeamsQuery} from '../graphql/teams';

import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';

function Sidebar({ currentTeamId }) {
    const [openAddChannelModal, setOpenAddChannelModal] = useState(false);

    function handleAddChannelClick() {
        setOpenAddChannelModal(true);
    }
    function handleCloseAddChannelClick() {
        setOpenAddChannelModal(false);
    }


    const { loading, error, data } = useQuery(allTeamsQuery);

    if(error)console.log(error.message)

    if (loading) return "loading";
    if (error) return "error";

    const { allTeams } = data;
    let teamIdx = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId)]) : 0;
    const team = allTeams[teamIdx];
    let username = '';

    try {
        const token = localStorage.getItem('token');
        const { user } = decode(token);
        username = user.username;
    } catch (error) { }


    return ([
        <Teams
            key="team-sidebar"
            teams={allTeams.map(t => ({
                id: t.id,
                letter: t.name.charAt(0).toUpperCase(),
            }))}
        />,
        <Channels
            key="channels-sidebar"
            teamName={team.name}
            username={username}
            channels={team.channels}
            users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
            onChannelAddClick={handleAddChannelClick}
        />,
        <AddChannelModal
            teamId={team.id}
            onClose={handleCloseAddChannelClick}
            open={openAddChannelModal}
            key="sidebar-add-channel-modal"
        />
    ]);
}

export default Sidebar;