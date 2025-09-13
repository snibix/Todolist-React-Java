package com.todo.todo_backend.repository;

import com.todo.todo_backend.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {}
