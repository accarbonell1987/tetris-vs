import React from 'react'

import style from './span.module.css'

const CustomSpan = ({ text, actionComponent }) => {
  return (
    <div className={style.divSpan}>
      <h5 className={style.spanBadge} variant="bordered">
        {`${text}`}
      </h5>
      {actionComponent}
    </div>
  )
}

export default CustomSpan
