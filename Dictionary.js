module.exports = {
    SocketEvents: {
        CLIENT_SEND_MESSAGE: 'CLIENT_SEND_MESSAGE',
        CLIENT_JOIN_ROOM: 'CLIENT_JOIN_ROOM',
        CLIENT_LEAVE_ROOM: 'CLIENT_LEAVE_ROOM',
        CLIENT_GET_ROOM_DATA: 'CLIENT_GET_ROOM_DATA',
        CLIENT_CREATE_ROOM: 'CLIENT_CREATE_ROOM',
        CLIENT_ERROR: 'CLIENT_ERROR',
        VOTING_PHASE_START: 'VOTING_PHASE_START',
        CLIENT_VOTE: 'CLIENT_VOTE',
        VOTING_PHASE_NEWVOTE: 'VOTING_PHASE_NEWVOTE',
        VOTING_PHASE_REVEAL: 'VOTING_PHASE_REVEAL',
        START_GAME: 'START_GAME',
        CHANCELLOR_CHOICE_PHASE: 'CHANCELLOR_CHOICE_PHASE',
        BECOME_FACIST: 'BECOME_FACIST',
        KillSuperpowerUsed: 'KILL_SUPERPOWER_USED',
        TEST_START_KILL_PHASE: 'TEST_START_KILL_PHASE',
        PlayerKilled: 'PLAYER_KILLED',
        GameFinished: 'GAME_FINISHED',
    },
    PlayerDirection: {
        PLAYER_DIRECTION_LEFT: 'PLAYER_DIRECTION_LEFT',
        PLAYER_DIRECTION_UP: 'PLAYER_DIRECTION_UP',
        PLAYER_DIRECTION_RIGHT: 'PLAYER_DIRECTION_RIGHT',
    },
    PlayerRole: {
        ROLE_CHANCELLOR: 'ROLE_CHANCELLOR',
        ROLE_PRESIDENT: 'ROLE_PRESIDENT',
        ROLE_PREVIOUS_CHANCELLOR: 'ROLE_PREVIOUS_CHANCELLOR',
        ROLE_PREVIOUS_PRESIDENT: 'ROLE_PREVIOUS_PRESIDENT',
    },
    GamePhases: {
        GAME_PHASE_NEW: 'GAME_PHASE_NEW',
        START_GAME: 'START_GAME',
        GAME_PHASE_CHANCELLOR_CHOICE: 'GAME_PHASE_CHANCELLOR_CHOICE',
        GAME_PHASE_VOTING: 'GAME_PHASE_VOTING',
        GAME_PHASE_SUPERPOWER: 'GAME_PHASE_SUPERPOWER',
        GAME_PHASE_FINISHED: 'GAME_PHASE_FINISHED',
    },
    PlayerAffilications: {
        LIBERAL_AFFILIATION: 'LIBERAL_AFFILIATION',
        FACIST_AFFILIATION: 'FACIST_AFFILIATION',
        HITLER_AFFILIATION: 'HITLER_AFFILIATION',
    },
    MessagesTypes: {
        ERROR: 'ERROR',
        INFO: 'INFO',
    },
    ErrorMessages: {
        notOwner: 'This action is forbidden! You are not the owner!',
    },
    ChoiceModeContexts: {
        ChancellorChoice: 'CONTEXT_CHANCELLOR_CHOICE',
        KillChoice: 'CONTEXT_KILL_CHOICE',
    },
}
