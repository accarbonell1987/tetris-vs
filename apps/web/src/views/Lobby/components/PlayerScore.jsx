import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  Button,
  CardFooter
} from '@nextui-org/react';

const PlayerScore = ({ useDisclosure, selectMaxScore }) => {
  const { isOpen, onOpenChange } = useDisclosure;

  const [selectedScorePoints, setSelectedScorePoint] = useState({
    min: 500,
    max: 3000,
    selectScore: null
  });

  const onSelect = event => {
    const { value } = event.target;
    setSelectedScorePoint({ ...selectedScorePoints, selectScore: value });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {onClose => (
          <>
            <Card>
              <CardBody className="flex flex-col gap-2">
                <label className="text-sm" htmlFor="selectMaxSocore">
                  Puntuación Máxima:
                </label>
                <Select
                  id="selectMaxSocore"
                  placeholder="Selecciona una puntuación máxima"
                  aria-label="Selecciona una puntuación máxima"
                  onChange={onSelect}
                  style={{ border: '1px solid #f0f0f0' }}>
                  {Array.from(
                    { length: selectedScorePoints.max / selectedScorePoints.min },
                    (_, i) => (
                      <SelectItem
                        key={(i + 1) * selectedScorePoints.min}
                        value={`${(i + 1) * selectedScorePoints.min}`}>
                        {`${(i + 1) * selectedScorePoints.min}`}
                      </SelectItem>
                    )
                  )}
                </Select>
              </CardBody>
              <CardFooter className="justify-center">
                <Button color="primary" size="md" onPress={onClose}>
                  Establecer
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PlayerScore;
