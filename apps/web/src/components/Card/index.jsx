import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';

const CustomCard = ({ header, body, footer, headDivider, footerDivider }) => {
  return (
    <Card variant="bordered" style={{ border: '1px solid #f0f0f0' }}>
      <CardHeader className="flex gap-3">{header}</CardHeader>
      {headDivider ? <Divider /> : null}
      <CardBody>{body}</CardBody>
      {footerDivider ? <Divider /> : null}
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
};

export default CustomCard;
