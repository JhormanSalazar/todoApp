import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  tasksV2 = signal<Task[]>([
    {
      id: 1,
      title: 'Tarea1',
      completed: false,
    },
    {
      id: 2,
      title: 'Tarea2',
      completed: false,
    },
    {
      id: 3,
      title: 'Tarea3',
      completed: false,
    },
    {
      id: 4,
      title: 'Tarea4',
      completed: false,
    },
  ]);

  inputChangeHandler() {
    const isValid = this.newTaskCtrl.valid;
    const value = this.newTaskCtrl.value;
    if (!isValid || value.trim() === '') return alert('Se debe ingresar un valor correcto, no vacío'); // Se verifica si cumple con el newTaskCtrl validators y si no viene con muchos espacios "     "; al usar return, no se hace lo que sigue, asi que no se ejecuta el metodo.
    this.addTask(this.newTaskCtrl.value);
    this.newTaskCtrl.setValue('');
  }

  addTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasksV2.update((tasksV2) => [...tasksV2, newTask]);
  }

  deleteTask(index: number) {
    this.tasksV2.update((tasksV2) =>
      tasksV2.filter((task, position) => position !== index)
    ); //Filtra el estado inicial de las tareas, excluyendo la tarea que tenga el index recibido como parametro
  }

  updateTask(index: number) {
    this.tasksV2.update((tasksV2) =>
      tasksV2.map((task, i) => {
        if (i === index) {
          task.completed = !task.completed;
        }
        return task;
      })
    );
  }
}
