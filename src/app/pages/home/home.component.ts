import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { Component, computed, signal } from '@angular/core';
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

  filter = signal('all');
  //Esta funcion muestra las tareas segun su estado: completado, pendiente, o por defecto.
  // Toma 2 señales, filter() y tasksV2(), con éstos determina el resultado.
  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasksV2();

    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  });

  updateCount(tasks: Task[]): string {
    let length = 0;
    const itemsWordLength = (tasks: Task[]) =>
      tasks.length === 1 ? 'item' : 'items';
    if (tasks.length >= 1) {
      length = tasks.length;
      itemsWordLength(tasks);
      return `${length} ${itemsWordLength(tasks)}`;
    }
    return `${length} ${itemsWordLength(tasks)}`;
  }

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
    if (!isValid || value.trim() === '')
      return alert('Se debe ingresar un valor correcto, no vacío'); // Se verifica si cumple con el newTaskCtrl validators y si no viene con muchos espacios "     "; al usar return, no se hace lo que sigue, asi que no se ejecuta el metodo.
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

  updateTaskEditingMode(index: number) {
    this.tasksV2.update((prevState) =>
      prevState.map((task, position) => {
        return {
          ...task,
          editing: position === index && !task.completed ? true : false,
        };
      })
    );
  }

  updateTaskTitle(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasksV2.update((prevState) =>
      prevState.map((task, position) => {
        return {
          ...task,
          title: position === index ? input.value : task.title,
          editing: false,
        };
      })
    );
  }

  changeFilter(filter: string) {
    this.filter.set(filter);
  }
}
