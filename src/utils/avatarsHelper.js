import Liberal1 from '../static/Avatar1.png'
import Liberal2 from '../static/Avatar2.png'
import Liberal3 from '../static/Avatar3.png'
import Liberal4 from '../static/Avatar4.png'
import Liberal5 from '../static/Avatar5.png'
import Liberal6 from '../static/Avatar6.png'

import Fascist21 from '../static/Avatar21.png'
import Fascist50 from '../static/Avatar50.png'

const avatarMapping = {
    'liberal-1': Liberal1,
    'liberal-2': Liberal2,
    'liberal-3': Liberal3,
    'liberal-4': Liberal4,
    'liberal-5': Liberal5,
    'liberal-6': Liberal6,
    'fascist-21': Fascist21,
    'fascist-50': Fascist50,
}

export const getAvatar = avatarKey => avatarMapping[avatarKey] || ''
