import React from 'react'

import styles from './NoResults.css'

export const NoResults = () => (
    <div className={styles.noResults}>
        <span className={styles.noResultsHeadline}>
            No rooms found at this moment
        </span>
        <span className={styles.noResultsParagraph}>
            {"Click on the 'New Room' button to your right to create a new room"}
        </span>
    </div>
)
