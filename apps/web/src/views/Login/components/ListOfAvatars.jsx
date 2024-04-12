import { Avatar, AvatarGroup } from '@nextui-org/react';
import { useDevice } from '../../../hooks';

const ListOfAvatars = ({ data, selectedAvatar, setSelectedAvatar }) => {
  const { isSmallScreen } = useDevice();

  if (!data) return null;

  return (
    <div className="flex gap-x-3 w-full justify-center">
      <AvatarGroup size="lg" max={!isSmallScreen ? 8 : 5}>
        {data?.map((image, index) => {
          const id = `avatar-${index}`;
          return (
            <Avatar
              key={id}
              className="w-20 h-20 text-large"
              src={image}
              isBordered={id === selectedAvatar.id}
              color="primary"
              onClick={() => {
                setSelectedAvatar({ id, image });
              }}
            />
          );
        })}
      </AvatarGroup>
    </div>
  );
};

export default ListOfAvatars;
