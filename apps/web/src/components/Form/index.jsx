import React from 'react'

import { CustomCard } from '..'

import style from './form.module.css'

const CustomForm = ({ handleOnSubmit, caption, submitButton, footer, children }) => {
  const CardForm = (
    <CustomCard
      header={<h1>{caption}</h1>}
      body={<div className={style.formChildren}>{children}</div>}
      footer={
        <>
          {submitButton}
          {footer}
        </>
      }
    />
  )

  return (
    <div>
      <form onSubmit={(event) => handleOnSubmit(event)}>{CardForm}</form>
    </div>
  )
}

export default CustomForm
