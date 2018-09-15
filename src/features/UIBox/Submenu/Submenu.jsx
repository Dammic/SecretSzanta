import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { get } from 'lodash'
import SubmenuComponent from './SubmenuComponent'

export class Submenu extends React.PureComponent {
    static displayName = 'Submenu'
    static propTypes = {
        affiliation: PropTypes.string,
        isAffiliationHidden: PropTypes.bool,
        role: PropTypes.string,
        liberalAvatar: PropTypes.number,
        fascistAvatar: PropTypes.number,
        isOwner: PropTypes.bool,
        isDead: PropTypes.bool,
    }

    render() {
        const { affiliation, isAffiliationHidden, role, liberalAvatar, fascistAvatar, isOwner, isDead } = this.props
        return (
            <SubmenuComponent
                affiliation={affiliation}
                isAffiliationHidden={isAffiliationHidden}
                role={role}
                liberalAvatar={liberalAvatar}
                fascistAvatar={fascistAvatar}
                isOwner={isOwner}
                isDead={isDead}
            />
        )
    }
}

const mapStateToProps = ({ user, room }) => {
    const player = get(room.playersDict, `${user.userName}`)
    return {
        affiliation: get(player, 'affiliation'),
        isAffiliationHidden: user.isAffiliationHidden,
        role: get(player, 'role'),
        fascistAvatar: get(player, 'facistAvatar'),
        liberalAvatar: get(player, 'avatarNumber'),
        isOwner: room.ownerName === user.userName,
        isDead: get(player, 'isDead'),
    }
}

export default connect(mapStateToProps)(Submenu)
