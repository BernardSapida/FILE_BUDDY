import { trpc } from '@/lib/trpc/client';
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
   const favoriteMutation = trpc.file.setFileFavorite.useMutation({
      onSuccess: () => {
         setFiles((prevFiles) =>
            prevFiles.map((file) =>
               file.id === fileId ? { ...file, favorited: !file.favorited } : file
            )
         );
         setFavorite((prevFavorite) => !prevFavorite);
         toast.success(`Successfully ${favorite ? 'removed' : 'added'} to favorite files`);
      },
      onError: () => {
         toast.error('There was an error, please try again');
      }
   });

   const handleFavoriteChange = () => {
      favoriteMutation.mutate({ fileId, favorited: !favorited });
   };

   return (
      <Button
         isIconOnly
         variant="light"
         onPress={handleFavoriteChange}
         isLoading={favoriteMutation.isLoading}
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
