import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"


type Todo = {
  id:number,
  title: string,
  done:boolean,
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    fetch("http://localhost:8080/api/todos")
    .then((res)=>res.json())
    .then((data)=>setTodos(data))
    .catch((error)=>console.error("Erreur fetch :",error))
  },[])

  const [newTodo, setNewTodo] = useState("");

  const toggleTodo = (id: number) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  const handleAdd = () => {
   if(newTodo.trim()==="") return;

   const todoToAdd = {title:newTodo, done:false}

   fetch("http://localhost:8080/api/todos",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoToAdd)
   })
   .then((res)=>{
    if(!res.ok) throw new Error("Erreur lors de la création");
    return res.json()
   })
   .then((createTodo) => {
    setTodos((todos)=>[...todos,createTodo])
    setNewTodo("");
   })
   .catch((error)=>console.error("Erreur fetch POST :", error))
   console.log("Ajout réussi")
  }

  const handleDelete = (id:number)=> {
    if(!id) return;

    fetch(`http://localhost:8080/api/todos/${id}`,{
      method: "DELETE",
    })
    .then((response)=>{
      if(!response.ok) {
        throw new Error("Erreur lors de la suppresion");
      };
      setTodos((todos.filter(todo=>todo.id ! ==id)))
    })
    .catch((err)=>console.error("Erreur delete",err));
  }
  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <div className="flex space-x-2 mt-6">
        <Input
          placeholder="Ajouter une tâche..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <Button onClick={handleAdd}>Ajouter</Button>
      </div>

      {todos.map(todo => (
        <Card key={todo.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={todo.done}
                onCheckedChange={() => toggleTodo(todo.id)}
              />
              <span className={todo.done ? "line-through text-muted-foreground" : ""}>
                {todo.title}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={()=>handleDelete(todo.id)}
            >
              Supprimer
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
