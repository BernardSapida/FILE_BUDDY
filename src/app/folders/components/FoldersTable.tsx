'use client';

import { getFormattedDateTime } from '@/lib/utils';
import {
   Button,
   Input,
   Pagination,
   Spinner,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
   Tooltip
} from '@nextui-org/react';
import Link from 'next/link';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { FaFolder } from 'react-icons/fa6';
import { IoIosArrowForward } from 'react-icons/io';
import { MdSearch } from 'react-icons/md';
import ChangeFoldername from './ChangeFoldername';
import CreateFolderModal from './CreateFolderModal';
import FavoriteToggle from './FavoriteToggle';
import { usePathname } from 'next/navigation';
import DeleteButton from './DeleteButton';
import TrashButton from './TrashButton';
import RestoreButton from './RestoreButton';

interface FoldersTableProps {
   folders: Folder[];
   showHeaderButtons?: boolean;
   isLoading: boolean;
}

export const columns = [
   { name: 'FAVORITE', uid: 'favorited', sortable: true },
   { name: 'FOLDER NAME', uid: 'folder_name', sortable: true },
   { name: 'BYTES', uid: 'bytes', sortable: true },
   { name: 'CREATED AT', uid: 'createdAt', sortable: true },
   { name: 'UPDATED AT', uid: 'updatedAt', sortable: true },
   { name: 'ACTIONS', uid: 'actions' }
];

export const statusOptions = [
   { name: 'Student', uid: 'student' },
   { name: 'Instructor', uid: 'instructor' }
];

const FoldersTable: FunctionComponent<FoldersTableProps> = ({
   folders: userFolders,
   showHeaderButtons = true,
   isLoading
}) => {
   const pathname = usePathname();
   const archivePath = pathname === '/archives';
   const trashPath = pathname === '/trash';
   const [folders, setFolders] = useState<Folder[]>([]);
   const [filterValue, setFilterValue] = useState('');
   const [selectedKeys, setSelectedKeys] = useState(new Set([]));
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [sortDescriptor, setSortDescriptor] = useState({
      column: 'name',
      direction: 'ascending'
   });
   const [page, setPage] = useState(1);
   const hasSearchFilter = Boolean(filterValue);

   const filteredItems = useMemo(() => {
      let filteredFolders = [...folders];

      if (hasSearchFilter) {
         filteredFolders = filteredFolders.filter((folder) =>
            folder.folder_name.toLowerCase().includes(filterValue.toLowerCase())
         );
      }

      return filteredFolders;
   }, [folders, filterValue]);

   const pages = Math.ceil(filteredItems.length / rowsPerPage);

   const items = useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return filteredItems.slice(start, end);
   }, [page, filteredItems, rowsPerPage]);

   const sortedItems = useMemo(() => {
      return [...items].sort((a: any, b: any) => {
         const first = a[sortDescriptor.column];
         const second = b[sortDescriptor.column];
         const cmp = first < second ? -1 : first > second ? 1 : 0;

         return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      });
   }, [sortDescriptor, items]);

   const renderCell = useCallback((folder: any, columnKey: any) => {
      const cellValue = folder[columnKey];

      switch (columnKey) {
         case 'id':
            return <FaFolder className="text-xl" />;
         case 'favorited':
            return (
               <FavoriteToggle
                  folderId={folder.id}
                  favorited={folder.favorited}
                  setFolders={setFolders}
               />
            );
         case 'folder_name':
            return (
               <div className="flex items-center gap-1">
                  <p className="max-w-48 truncate">{cellValue}</p>
                  <ChangeFoldername
                     folderId={folder.id}
                     folderName={folder.folder_name}
                     setFolders={setFolders}
                  />
               </div>
            );
         case 'createdAt':
         case 'updatedAt':
            return getFormattedDateTime(cellValue as Date);
         case 'actions':
            return (
               <Tooltip content="View folder">
                  <Button
                     isIconOnly
                     variant="light"
                     size="sm"
                     startContent={<IoIosArrowForward />}
                     as={Link}
                     href={`/folder/${folder.id}`}
                  />
               </Tooltip>
            );
         default:
            return cellValue;
      }
   }, []);

   const onNextPage = useCallback(() => {
      if (page < pages) {
         setPage(page + 1);
      }
   }, [page, pages]);

   const onPreviousPage = useCallback(() => {
      if (page > 1) {
         setPage(page - 1);
      }
   }, [page]);

   const onRowsPerPageChange = useCallback((e: any) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
   }, []);

   const onSearchChange = useCallback((value: string) => {
      if (value) {
         setFilterValue(value);
         setPage(1);
      } else {
         setFilterValue('');
      }
   }, []);

   const onClear = useCallback(() => {
      setFilterValue('');
      setPage(1);
   }, []);

   const addToTrash = () => {
      setFolders((prevFolders) => {
         if (selectedKeys.toString() == 'all') return [];

         return prevFolders.filter((folder) => {
            if (![...(selectedKeys.values() as any)].includes(folder.id)) return folder;
         });
      });
   };

   const topContent = useMemo(() => {
      return (
         <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-3">
               <Input
                  isClearable
                  className="w-full sm:max-w-[44%]"
                  placeholder="Search by folder name"
                  startContent={<MdSearch />}
                  value={filterValue}
                  onClear={() => onClear()}
                  onValueChange={onSearchChange}
               />
               {showHeaderButtons && (
                  <div className="space-x-2">
                     {!archivePath && !trashPath && <CreateFolderModal setFolders={setFolders} />}
                     {trashPath ? (
                        <>
                           <RestoreButton
                              selectedKeys={selectedKeys}
                              setFolders={setFolders}
                           />
                           <DeleteButton
                              selectedKeys={selectedKeys}
                              setFolders={setFolders}
                           />
                        </>
                     ) : (
                        <TrashButton
                           selectedKeys={selectedKeys}
                           setFolders={setFolders}
                        />
                     )}
                  </div>
               )}
            </div>
            <div className="flex items-center justify-between">
               <span className="text-small text-default-400">Total {folders.length} folders</span>
               <label className="flex items-center text-small text-default-400">
                  Rows per page:
                  <select
                     className="bg-transparent text-small text-default-400 outline-none"
                     onChange={onRowsPerPageChange}
                     defaultValue="5"
                  >
                     <option value="5">5</option>
                     <option value="10">10</option>
                     <option value="15">15</option>
                  </select>
               </label>
            </div>
         </div>
      );
   }, [
      filterValue,
      onRowsPerPageChange,
      folders.length,
      onSearchChange,
      hasSearchFilter,
      selectedKeys
   ]);

   const bottomContent = useMemo(() => {
      return (
         <div className="flex items-center justify-between px-2 py-2">
            <Pagination
               isCompact
               showControls
               showShadow
               color="primary"
               page={page}
               total={pages}
               onChange={setPage}
            />
            <div className="hidden w-[30%] justify-end gap-2 sm:flex">
               <Button
                  isDisabled={pages === 1}
                  size="sm"
                  variant="flat"
                  onPress={onPreviousPage}
               >
                  Previous
               </Button>
               <Button
                  isDisabled={pages === 1}
                  size="sm"
                  variant="flat"
                  onPress={onNextPage}
               >
                  Next
               </Button>
            </div>
         </div>
      );
   }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

   useEffect(() => {
      if (!isLoading) setFolders(userFolders);
   }, [isLoading]);

   return (
      <Table
         isHeaderSticky
         aria-label="Folders table"
         bottomContent={bottomContent}
         bottomContentPlacement="outside"
         selectedKeys={selectedKeys}
         sortDescriptor={sortDescriptor as any}
         topContent={topContent}
         topContentPlacement="outside"
         onSelectionChange={setSelectedKeys as any}
         onSortChange={(value: any) => setSortDescriptor(value)}
         selectionMode={showHeaderButtons ? 'multiple' : 'none'}
         selectionBehavior="replace"
      >
         <TableHeader columns={columns}>
            {(column: any) => (
               <TableColumn
                  key={column.uid}
                  align={column.uid === 'actions' ? 'center' : 'start'}
                  allowsSorting={column.sortable}
               >
                  {column.name}
               </TableColumn>
            )}
         </TableHeader>
         <TableBody
            emptyContent={'No results found'}
            isLoading={isLoading}
            loadingContent={
               <Spinner
                  size="sm"
                  label="Loading..."
                  color="default"
               />
            }
            items={sortedItems}
         >
            {(folder: Folder) => (
               <TableRow key={folder.id}>
                  {(columnKey) => (<TableCell>{renderCell(folder, columnKey)}</TableCell>) as any}
               </TableRow>
            )}
         </TableBody>
      </Table>
   );
};

export default FoldersTable;
