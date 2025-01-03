import { Button } from '@nextui-org/react';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'sonner';

interface FavoriteToggleProps {
   fileId: string;
   favorited: boolean;
   setFiles: Dispatch<SetStateAction<File[]>>;
}

const FavoriteToggle: FunctionComponent<FavoriteToggleProps> = ({
   fileId,
   favorited,
   setFiles
}) => {
   const [favorite, setFavorite] = useState<boolean>(favorited);

   const handleFavoriteChange = () => {
      toast.promise(new Promise((resolve) => setTimeout(() => resolve({}), 1000)), {
         loading: ` ${favorite ? 'Removing' : 'Adding'} to favorite files...`,
         success: () => {
            setFiles((prevFiles) =>
               prevFiles.map((file) =>
                  file.id === fileId ? { ...file, favorited: !file.favorited } : file
               )
            );
            setFavorite((prevFavorite) => !prevFavorite);

            return `Successfully ${favorite ? 'removed' : 'added'} to favorite files!`;
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
