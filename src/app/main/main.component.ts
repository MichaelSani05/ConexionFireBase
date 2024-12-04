import { Component } from '@angular/core';
import { Database, ref, push, DatabaseInstances } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { timer } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  providers: [FormBuilder]
})
export class MainComponent {
  form: FormGroup;
  form2: FormGroup;
  private solicitar = true;

  constructor(private db: Database, private fb: FormBuilder, private fb2: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      poblacion: ['', Validators.required],
      trabajo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    
    this.form2 = this.fb2.group({
      empresa: ['', Validators.required],
      empleo: ['', Validators.required],
      poblacion2: ['', Validators.required],
      experiencia: ['', Validators.required],
      email2: ['', [Validators.required, Validators.email]],
    });

  }

  ngOnInit() {
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const solicitar = document.getElementById('solicitar');
    const ofrecer = document.getElementById('ofrecer');

    if (button1 && button2) {
      button1.addEventListener('click', () => this.solicitarForm());
      button2.addEventListener('click', () => this.ofrecerForm());
    }

    if (solicitar) {
      solicitar.addEventListener('click', () => this.solicitarSubmit())
    }
    
    if (ofrecer) {
      ofrecer.addEventListener('click', () => this.ofrecerSubmit())
    }

  }

  solicitarSubmit() {
    const { nombre, apellidos, poblacion, trabajo, email } = this.form.value;
    const solicitudesRef = ref(this.db, 'solicitudes');
    push(solicitudesRef, { nombre, apellidos, poblacion, trabajo, email })
      .then(() => {
        console.log('Solicitud añadida correctamente a la base de datos.');
        this.form.reset();
      })
      .catch((error) => console.error('Error al añadir la solicitud: ', error));
  }

  ofrecerSubmit() {
    const { empresa, empleo, poblacion2, experiencia, email2 } = this.form2.value;
    const ofertasRef = ref(this.db, 'ofertas');
    push(ofertasRef, { empresa, empleo, poblacion2, experiencia, email2 })
      .then(() => {
        console.log('Oferta añadida correctamente a la base de datos.');
        this.form2.reset();
      })
      .catch((error) => console.error('Error al añadir la oferta: ', error));
  }

  ofrecerForm() {
    const form = document.getElementById("form");
    const form2 = document.getElementById("form2");
    const hero1 = document.getElementById("hero-1");
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');

    if (form && hero1 && form2 && button1 && button2) {
      if (this.solicitar) {
        form2.style.transform = "translateX(-100%)";
        form.style.transform = "translateX(-100%)";
        form.style.opacity = "0";
        hero1.style.transform = "translateX(100%)";
        this.solicitar = false;
        button2.style.backgroundColor = "#635D75";
        button1.style.backgroundColor = "#2B2738";
        console.log("Solicitar cambiado a Ofrecer");
        setTimeout(form2.style.display = "flex", 0);
        setTimeout(form2.style.opacity = "1", 200);
        setTimeout(form.style.display = "none", 500);
      }
    } else {
      console.error("No se encontraron los elementos form o hero1 en el DOM.");
    }

  }

  solicitarForm(){
    const form = document.getElementById("form");
    const hero1 = document.getElementById("hero-1");
    const form2 = document.getElementById("form2");
    
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');

    if(form && hero1 && form2 && button1 && button2) {
      if(!this.solicitar){
        form.style.transform = "translateX(0%)";
        form.style.opacity = "1";
        hero1.style.transform = "translateX(0%)";
        button1.style.backgroundColor = "#635D75";
        button2.style.backgroundColor = "#2B2738";
        this.solicitar = true;
        setTimeout(form.style.display = "flex", 200);
        setTimeout(form2.style.opacity = "0", 200);
        setTimeout(form2.style.display = "none", 500);
        console.log("Ofrecer cambiado a Solicitar");
      }
    }


  }

}
