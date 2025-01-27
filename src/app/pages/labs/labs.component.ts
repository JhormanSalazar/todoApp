import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css',
})
export class LabsComponent {
  welcome = 'Hola este es mi primer proyecto';
  tasks = ['Crear proyecto', 'Instalar angular', 'Modificar componente'];
  tasksV2 = signal(['Signal1', 'Signal2 angular', 'Signal3 componente']);
  name = 'Jhorman';
  nickname = signal('Morgone');
  disabled = true;
  img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXGn8w9H7d6E-ne45B18CYwNs3qWoCUBMXkg&s';

  constructor(){
    this.colorControl.valueChanges.subscribe(value => {
      console.log(value);
    })
  }

  person = signal({
    name: 'Jhorman',
    description: signal('Hello'),
    age: 19,
    avatar: this.img,
  });

  //ReactiveForms
  colorControl = new FormControl();
  widthControl = new FormControl(100, {
    nonNullable: true,
  })
  nameControl = new FormControl('Ingresa tu nombre', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  })

  showTextLP() {
    alert('Yes, you are');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person().description.set(newValue);
  }

  keydownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    alert(input.value);
  }

  changeAgeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update((prevState) => {
      return {
        ...prevState,
        age: parseInt(newValue, 10),
      };
    });
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    const newName = input.value;

    this.person.update((prevState) => {
      return {...prevState, name: newName }
    })
  }
}
