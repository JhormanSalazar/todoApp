import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Filter } from '../../types/filter.type';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  injector = inject(Injector);

  // constructor() {
  //   effect(() => {
  //     const tasks = this.tasksV2();
  //     localStorage.setItem('tasks', JSON.stringify(tasks));
  //   })
  // }

  ngOnInit() { // Este metodo se ejecuta al usar nuestro componente, es decir cada vez que lo estamos usando. Se encarga de verificar si existe un item "tasks" en el localStorage, si existe entonces guardamos el array ya des serializado en una variable 'tasks' y le seteamos este valor al array de tareas que es una signal con .set(tasks), es decir tasksV2() toma el valor del array que está en el localStorage. Luego se ejecuta el metodo trackTasks para detectar los cambios en el array de las tareas y actualizar el item "tasks" en el localStorage;
    const storage = localStorage.getItem('tasks');
    if(storage) {
    const tasks = JSON.parse(storage);
    console.log(tasks);
    this.tasksV2.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks() { // Este metodo actualiza los cambios en el local storage al detectar cambios en la señal tasksV2();
    effect(() => {
      const tasks = this.tasksV2();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector }); // El metodo effect debe tener un injector cuando esta fuera del constructor. Este se encarga de ejecutar una funcion cada vez que la señal que esta monitorieando cambia, en este caso las tasksV2()
  }

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });


  filter = signal<Filter>('all');
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

  tasksV2 = signal<Task[]>([]);

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

  updateTaskEditingMode(index: number) { // Este metodo se usa para cambiar el estado de edicion de una tarea; Si se da doble click en la tarea entonces le pasamos el index de esta tarea en el array, luego actualizamos el array con .update(); y al estado previo le retornamos un array al que se le editó la tarea con su propiedad editing en true o false.
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

  changeFilter(filter: Filter) {
    this.filter.set(filter);
  }
}
