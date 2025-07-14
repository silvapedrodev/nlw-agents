import { useForm } from "react-hook-form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "./ui/card"
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useCreateRoom } from "@/http/use-create-room"

const createRoomSchema = z.object({
  name: z.string().min(3, { message: 'Inclua no mínimo 3 caracteres' }),
  description: z.string(),
})

type createRoomFormData = z.infer<typeof createRoomSchema>

export function CreateRoomForm() {
  const { mutateAsync: createRoom } = useCreateRoom()

  const createRoomForm = useForm<createRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  async function handleCreateRoom({name, description}: createRoomFormData) {
    await createRoom({ name, description })
    createRoomForm.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Sala</CardTitle>
        <CardDescription>
          Crie uma nova sala para começar a fazer perguntas e receber respostas da I.A
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...createRoomForm}>
          <form 
            className="flex flex-col gap-4"
            onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
          >
            <FormField 
              control={createRoomForm.control}
              name="name"
              render={( {field} ) => {
                return (
                  <FormItem>
                    <FormLabel>Nome da sala</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Digite o nome da sala..."/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <FormField 
              control={createRoomForm.control}
              name="description"
              render={( {field} ) => {
                return (
                  <FormItem>
                    <FormLabel>descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Digite a descrição..."/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <Button type="submit" className="w-full">Criar Sala</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}