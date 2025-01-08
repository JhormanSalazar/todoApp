import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
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

  inputChangeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const title = input.value;
    this.addTask(title);
    input.value = '';
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
