import { Button } from '@nextui-org/react';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'sonner';

interface FavoriteToggleProps {
   folderId: string;
   favorited: boolean;
   setFolders: Dispatch<SetStateAction<Folder[]>>;
}

const FavoriteToggle: FunctionComponent<FavoriteToggleProps> = ({
   folderId,
   favorited,
   setFolders
}) => {
   const [favorite, setFavorite] = useState<boolean>(favorited);

   const handleFavoriteChange = () => {
      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: ` ${favorite ? 'Removing' : 'Adding'} to favorite folders...`,
         success: () => {
            setFolders((prevFolders) =>
               prevFolders.map((folder) =>
                  folder.id === folderId ? { ...folder, favorited: !folder.favorited } : folder
               )
            );
            setFavorite((prevFavorite) => !prevFavorite);

            return `Successfully ${favorite ? 'removed' : 'added'} to favorite folders!`;
         },
         error: () => {
            return 'There was an error, please try again';
         }
      });
   };

   return (
      <Button
         isIconOnly
         variant="light"
         onPress={handleFavoriteChange}
      >
         {favorite ? (
            <FaHeart className="text-xl text-red-500" />
         ) : (
            <FaRegHeart className="text-xl text-red-500" />
         )}
      </Button>
   );
};

export default FavoriteToggle;
