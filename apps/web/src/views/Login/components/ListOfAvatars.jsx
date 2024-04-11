import { Avatar, AvatarGroup } from '@nextui-org/react';

const ListOfAvatars = ({ data, selectedAvatar, setSelectedAvatar }) => {
  if (!data) return null;

  return (
    <div className="flex gap-x-3">
      <AvatarGroup size="lg" max={8}>
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
