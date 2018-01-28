module.exports = {
    SocketEvents: {
        SelectName: 'CLIENT_SELECT_NAME',
        SyncLobby: 'SYNC_LOBBY',
        SyncPolicies: 'SYNC_POLICIES',
        IncreaseTrackerPosition: 'IncreaseTrackerPosition',
        PlayersListChanged: 'PLAYERS_LIST_CHANGED',
        SyncRoomsList: 'SYNC_ROOMS_LIST',
        RoomsListChanged: 'ROOMS_LIST_CHANGED',
        AllowEnteringRoom: 'ALLOW_ENTERING_ROOM',
        ServerWaitingForVeto: 'SERVER_WAITING_FOR_VETO',
        VetoVoteRegistered: 'VETO_VOTE_REGISTERED',
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
        PlayerKilled: 'PLAYER_KILLED',
        PlayerKicked: 'PLAYER_KICKED',
        PlayerBanned: 'PLAYER_BANNED',
        GameFinished: 'GAME_FINISHED',
        PresidentChoosePolicy: 'PRESIDENT_CHOOSE_POLICY',
        ChancellorChoosePolicy: 'CHANCELLOR_CHOOSE_POLICY',
        ChoosePolicy: 'CHOOSE_POLICY',
        NewPolicy: 'NEW_POLICY',
        ResetTracker: 'RESET_TRACKER',
        SetTimer: 'SET_TIMER',
        DesignateNextPresident: 'DESIGNATE_NEXT_PRESIDENT',
        SuperpowerAffiliationPeekPlayerChoose: 'SUPERPOWER_AFFILIATION_PEEK_PLAYER_CHOOSE',
        SuperpowerAffiliationPeekAffiliationReveal: 'SUPERPOWER_AFFILIATION_PEEK_AFFILIATION_REVEAL',
        PeekCards: 'PEEK_CARDS',
        SetChooserPlayer: 'SET_CHOOSER_PLAYER',
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
        PresidentPolicyChoice: 'GAME_PHASE_PRESIDENT_POLICY_CHOICE',
        ChancellorPolicyChoice: 'GAME_PHASE_CHANCELLOR_POLICY_CHOICE',
        ServerWaitingForVeto: 'GAME_PHASE_SERVER_WAITING_FOR_VETO',
        ServerAcceptedVeto: 'GAME_PHASE_SERVER_ACCEPTED_VETO',
        Paused: 'GAME_PHASE_PAUSE',
        DesignateNextPresidentPhase: 'GAME_PHASE_DESIGNATE_NEXT_PRESIDENT',
        PeekAffiliationSuperpowerPhase: 'PEEK_AFFILIATION_SUPERPOWER_PHASE',
        PeekCardsSuperpower: 'GAME_PHASE_PEEK_CARDS_SUPERPOWER',
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
        notPresident: 'This action is reserved for president!',
        notChancellor: 'This action is reserved for chancellor!',
        NameTaken: 'The selected name is already taken',
    },
    ChoiceModeContexts: {
        ChancellorChoice: 'CONTEXT_CHANCELLOR_CHOICE',
        KillChoice: 'CONTEXT_KILL_CHOICE',
        KickChoice: 'CONTEXT_KICK_CHOICE',
        BanChoice: 'CONTEXT_BAN_CHOICE',
        DesignateNextPresidentChoice: 'CONTEXT_DESIGNATE_NEXT_PRESIDENT_CHOICE',
        AffiliationPeekChoice: 'CONTEXT_AFFILIATION_PEEK_CHOICE',
    },
    PolicyCards: {
        FacistPolicy: 'FACIST_POLICY',
        LiberalPolicy: 'LIBERAL_POLICY',
    },
    Views: {
        Home: 'HOME',
        Lobby: 'LOBBY',
        HowToPlay: 'HOW_TO_PLAY',
        News: 'NEWS',
        About: 'ABOUT',
        Game: 'GAME',
    },
    PlayerBoards: {
        SmallBoard: 'SMALL_BOARD',
        MediumBoard: 'MEDIUM_BOARD',
        LargeBoard: 'LARGE_BOARD',
    },
    GlobalRoomName: 'Global',
}
