import React from 'react'

import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react'

const CustomCard = ({ header, body, footer, headDivider, footerDivider }) => {
  return (
    <Card variant="bordered" isHoverable>
      <CardHeader className="flex gap-3">{header}</CardHeader>
      {headDivider ? <Divider /> : null}
      <CardBody>{body}</CardBody>
      {footerDivider ? <Divider /> : null}
      <CardFooter>{footer}</CardFooter>
    </Card>
  )
}

export default CustomCard
