import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, User } from '@nextui-org/react';

/** Incoming challenge: shown while `challenger` is set. */
const ChallengeModal = ({ challenger, onAccept, onDecline }) => {
  return (
    <Modal isOpen={Boolean(challenger)} onClose={onDecline} isDismissable={false} hideCloseButton>
      <ModalContent>
        <ModalHeader>¡Te desafían!</ModalHeader>
        <ModalBody>
          <User name={challenger?.name} description="quiere jugar contigo" avatarProps={{ src: challenger?.image }} />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onDecline}>
            Rechazar
          </Button>
          <Button color="warning" onPress={onAccept}>
            Aceptar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChallengeModal;
