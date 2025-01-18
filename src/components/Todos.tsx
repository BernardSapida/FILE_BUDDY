import { trpc } from '@/lib/trpc/client';
import {
   Drawer,
   DrawerContent,
   DrawerHeader,
   DrawerBody,
   DrawerFooter,
   Button,
   useDisclosure
} from '@heroui/react';
import { Checkbox, Form, Input } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { LuListTodo } from 'react-icons/lu';
import { MdCreate } from 'react-icons/md';
import { toast } from 'sonner';

export default function App() {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const formRef = useRef<HTMLFormElement>(null);
   const [todos, setTodos] = useState<Todo[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const { data, isLoading } = trpc.todo.getTodos.useQuery();
   const createMutation = trpc.todo.createTodo.useMutation({
      onSuccess: (data) => {
         setLoading(false);
         formRef.current?.reset();
         setTodos((prevTodos) => [data, ...prevTodos]);
         toast.success('Successfully added new todo');
      },
      onError: () => {
         toast.error('There was an error, please try again');
         setLoading(false);
      }
   });
   const checkMutation = trpc.todo.checkTodo.useMutation({
      onSuccess: (data) => {
         setLoading(false);
         formRef.current?.reset();
         setTodos((prevTodos: Todo[]) => [
            ...prevTodos.map((todo: Todo) => {
               if (todo.id === data.id) {
                  todo.finished = data.finished;
               }
               return todo;
            })
         ]);
      }
   });
   const deleteMutation = trpc.todo.deleteTodo.useMutation({
      onSuccess: (data) => {
         setLoading(false);
         formRef.current?.reset();
         setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== data.id));
         toast.success('Successfully removed todo');
      }
   });
   const doneTodos = todos.filter(({ finished }) => finished).length;

   const onSubmit = (e: any) => {
      e.preventDefault();

      setLoading(true);

      const data: {
         name: string;
         finished: boolean;
      } = Object.fromEntries(new FormData(e.currentTarget)) as any;
      createMutation.mutate({ name: data.name });
   };

   const checkboxOnChange = (id: string, isSelected: boolean) => {
      checkMutation.mutate({ id: id, finished: isSelected });
   };

   const deleteTodo = (id: string) => {
      deleteMutation.mutate({ id: id });
   };

   useEffect(() => {
      if (!isLoading) setTodos(data!);
   }, []);

   return (
      <>
         <Button
            className="fixed bottom-10 right-10 rounded-full"
            color="primary"
            size="lg"
            onPress={onOpen}
            isIconOnly
         >
            <LuListTodo className="text-2xl" />
         </Button>
         <Drawer
            isOpen={isOpen}
            backdrop="blur"
            onOpenChange={onOpenChange}
            size="sm"
         >
            <DrawerContent>
               {() => (
                  <>
                     <DrawerHeader className="flex flex-col gap-1">
                        <p>To-Do List</p>
                        <p className="text-tiny">
                           {doneTodos}/{todos.length} tasks completed (
                           {todos.length == 0 ? 0 : Math.round((doneTodos / todos.length) * 100)}%)
                        </p>

                        <Form
                           validationBehavior="native"
                           onSubmit={onSubmit}
                           className="mt-3 flex flex-row gap-5"
                           ref={formRef}
                        >
                           <Input
                              type="text"
                              name="name"
                              placeholder="Add new task"
                              aria-label="New task input"
                              validate={(value) => {
                                 if (!value) return 'Task name is required';
                              }}
                              isRequired
                           />
                           <Button
                              type="submit"
                              color="primary"
                              isLoading={loading}
                              isDisabled={loading}
                           >
                              {loading ? 'Adding...' : 'Add'}
                           </Button>
                        </Form>
                     </DrawerHeader>
                     <DrawerBody className="overflow-y-scroll">
                        {todos.length === 0 && (
                           <p className="text-center text-default-400">No tasks yet! Add some</p>
                        )}
                        {todos.map((todo) => (
                           <div
                              key={todo.id}
                              className="flex items-center justify-between gap-2 rounded-sm p-3 shadow-sm transition-all duration-250 hover:shadow-md"
                           >
                              <Checkbox
                                 defaultSelected={todo.finished}
                                 onValueChange={(isSelected) =>
                                    checkboxOnChange(todo.id, isSelected)
                                 }
                              />
                              <p className="w-full">{todo.name}</p>
                              <Button
                                 size="sm"
                                 isIconOnly
                                 color="danger"
                                 startContent={<FiTrash2 />}
                                 onPress={() => deleteTodo(todo.id)}
                              />
                           </div>
                        ))}
                     </DrawerBody>
                  </>
               )}
            </DrawerContent>
         </Drawer>
      </>
   );
}
