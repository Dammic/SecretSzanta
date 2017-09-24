import React from 'react'

const WinningModalComponent = ({ winners, losers}) => {
    return (
        <div className="portraits">
            {winners}
            {losers}
        </div>
    )
}

export default WinningModalComponent
