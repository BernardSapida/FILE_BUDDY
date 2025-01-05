'use client';

import FileTag from '@/app/files/components/FileTag';
import { getFormattedDateTime } from '@/lib/utils';
import {
   Button,
   Chip,
   Input,
   Pagination,
   Spinner,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow
} from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { Dispatch, FunctionComponent, SetStateAction, useCallback, useMemo, useState } from 'react';
import { FaFolder } from 'react-icons/fa6';
import { MdSearch } from 'react-icons/md';
import ArchiveFile from './ArchiveFile';
import ChangeFilename from './ChangeFilename';
import CloudinaryUploadButton from './CloudinaryUploadButton';
import DeleteButton from './DeleteButton';
import DownloadFile from './DownloadFile';
import FavoriteToggle from './FavoriteToggle';
import RestoreButton from './RestoreButton';
import TrashButton from './TrashButton';

interface FilesTableProps {
   files: File[];
   setFiles: Dispatch<SetStateAction<File[]>>;
   folderId?: string;
   showHeaderButtons?: boolean;
   isLoading: boolean;
}

export const columns = [
   { name: 'FAVORITE', uid: 'favorited', sortable: true },
   { name: 'FILENAME', uid: 'filename', sortable: true },
   { name: 'FOLDER', uid: 'folder', sortable: true },
   { name: 'BYTES', uid: 'bytes', sortable: true },
   { name: 'TYPE', uid: 'type', sortable: true },
   { name: 'TAG', uid: 'tag', sortable: true },
   { name: 'CREATED AT', uid: 'createdAt', sortable: true },
   { name: 'UPDATED AT', uid: 'updatedAt', sortable: true },
   { name: 'ACTIONS', uid: 'actions' }
];

export const statusOptions = [
   { name: 'Student', uid: 'student' },
   { name: 'Instructor', uid: 'instructor' }
];

const FilesTable: FunctionComponent<FilesTableProps> = ({
   files,
   setFiles,
   folderId,
   showHeaderButtons = true,
   isLoading
}) => {
   const pathname = usePathname();
   const archivePath = pathname === '/archives';
   const trashPath = pathname === '/trash';
   const favoritePath = pathname === '/favorites';
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
      let filteredFiles = [...files];

      if (hasSearchFilter) {
         filteredFiles = filteredFiles.filter(
            (file) =>
               file.filename.toLowerCase().includes(filterValue.toLowerCase()) ||
               file.folder.folder_name.toLowerCase().includes(filterValue.toLowerCase()) ||
               file.type.toLowerCase().includes(filterValue.toLowerCase()) ||
               file.tag.toLowerCase().includes(filterValue.toLowerCase())
         );
      }

      return filteredFiles;
   }, [files, filterValue]);

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

   const renderCell = useCallback((file: any, columnKey: any) => {
      const cellValue = file[columnKey];

      switch (columnKey) {
         case 'id':
            return <FaFolder className="text-xl" />;
         case 'favorited':
            return (
               <FavoriteToggle
                  fileId={file.id}
                  favorited={file.favorited}
                  setFiles={setFiles}
               />
            );
         case 'filename':
            return (
               <div className="flex items-center gap-1">
                  <p className="max-w-48 truncate">{cellValue}</p>
                  <ChangeFilename
                     fileId={file.id}
                     filename={file.filename}
                     setFiles={setFiles}
                  />
               </div>
            );
         case 'folder':
            return file.folder.folder_name;
         case 'type':
            return (
               <Chip
                  variant="flat"
                  color="secondary"
                  size="sm"
               >
                  {cellValue}
               </Chip>
            );
         case 'tag':
            return (
               <div className="flex items-center gap-1">
                  <Chip
                     size="sm"
                     variant="shadow"
                     color={file.tag_color}
                  >
                     {cellValue}
                  </Chip>
                  <FileTag
                     fileId={file.id}
                     tag={cellValue}
                     tagColor={file.tag_color}
                     setFiles={setFiles}
                  />
               </div>
            );
         case 'createdAt':
         case 'updatedAt':
            return getFormattedDateTime(cellValue as Date);
         case 'actions' as any:
            return (
               <div>
                  <ArchiveFile
                     fileId={file.id}
                     setFiles={setFiles}
                  />
                  <DownloadFile
                     filename={file.filename}
                     type={file.type}
                     secureUrl={file.secure_url}
                  />
               </div>
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

   const topContent = useMemo(() => {
      return (
         <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-3">
               <Input
                  isClearable
                  className="w-full max-w-64"
                  placeholder="Search by filename"
                  startContent={<MdSearch />}
                  value={filterValue}
                  onClear={() => onClear()}
                  onValueChange={onSearchChange}
               />
               {showHeaderButtons && (
                  <div className="flex gap-2">
                     {!archivePath && !trashPath && !favoritePath && (
                        <CloudinaryUploadButton
                           folderId={folderId!}
                           setFiles={setFiles}
                        />
                     )}
                     {trashPath ? (
                        <>
                           <RestoreButton
                              selectedKeys={selectedKeys}
                              setFiles={setFiles}
                           />
                           <DeleteButton
                              selectedKeys={selectedKeys}
                              setFiles={setFiles}
                           />
                        </>
                     ) : (
                        <TrashButton
                           selectedKeys={selectedKeys}
                           setFiles={setFiles}
                        />
                     )}
                  </div>
               )}
            </div>
            <div className="flex items-center justify-between">
               <span className="text-small text-default-400">Total {files.length} files</span>
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
      files.length,
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

   return (
      <Table
         isHeaderSticky
         aria-label="Files table"
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
            emptyContent={'No files'}
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
            {(file: File) => (
               <TableRow key={file.asset_id}>
                  {(columnKey) => (<TableCell>{renderCell(file, columnKey)}</TableCell>) as any}
               </TableRow>
            )}
         </TableBody>
      </Table>
   );
};

export default FilesTable;
