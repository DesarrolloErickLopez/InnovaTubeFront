import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/service/login/login.service';
import { loginModel, registerModel } from'../../models/login';
import { MessageService } from 'primeng/api'; 
import { Router } from '@angular/router';
import { RecaptchaService } from '../../service/service/recaptcha.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]

})
export class LoginComponent {
  public robot!: boolean;
  public presionado!: boolean;
  public login: loginModel = { usuario: '', contrasenia: '' };
  public register: registerModel = {
    nombre: 'Erick',
    ap_paterno: 'López',
    ap_materno: 'Rojas',
    correo: 'erick@gmail.com ',
    contrasenia: 'Erick0802',
    confirmarContrasenia: 'Erick0802'
  };
  registroVisible: boolean = true;
  



  constructor(
    public LoginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private httpService: RecaptchaService,  
    private recaptchaV3Service: ReCaptchaV3Service
    ){
    

  }

  ngOnInit(): void {
    this.robot = true;
    this.presionado = false;
  }


  public iniciarSesion(){
    try {
      this.LoginService.inicioDeSesion(this.login).subscribe(
        (data: any) => {
          if(data.status != 1){
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.mensaje });
          }
          if(data.status === 1){
            console.log(data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.mensaje });
            localStorage.setItem('usuario', JSON.stringify(data.data));
            this.router.navigate(['/home']);
          }
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    } catch (error) {
      console.error('Error inesperado:', error);
      
    }  
  }

  public registrarUsuario() {
    try {
      this.LoginService.registrarUsuario(this.register).subscribe(
        (data: any) => {
          if (data.status != 1) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.mensaje });
          }
          if (data.status === 1) {
            console.log(data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.mensaje });
            localStorage.setItem('usuario', JSON.stringify(data.data));
            this.router.navigate(['/home']);
          }
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  }
  

  public get validarFormularioLogin(): boolean{
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(
      this.login.usuario &&
      emailPattern.test(this.login.usuario) &&
      this.login.contrasenia
    ) return false;
    return true;
  }

  public get validarFormularioRegister(): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (
      this.register.nombre &&
      this.register.ap_paterno &&
      this.register.ap_materno &&
      this.register.correo &&
      emailPattern.test(this.register.correo) &&
      this.register.contrasenia &&
      passwordPattern.test(this.register.contrasenia) &&
      this.register.contrasenia === this.register.confirmarContrasenia
    ) {
      return false;
    }

    return true;
  }

  getInfoRecaptcha() {
    this.robot = true;
    this.presionado = true;
    this.recaptchaV3Service.execute('')
      .subscribe((token) => {
          const auxiliar = this.httpService.getTokenClientModule(token)
          auxiliar.subscribe( {
            complete: () => {
              this.presionado = false;
            },
            error: () => {
              this.presionado = false;
              this.robot = true;
              // alert('Tenemos un problema, recarga la página página para solucionarlo o contacta con 1938web@gmail.com');
            },
            next: (resultado: Boolean) => {
              if (resultado === true) {
                this.presionado = false;
                this.robot = false;
              } else {
                // alert('Error en el captcha. Eres un robot')
                this.presionado = false;
                this.robot = true;
              }
            }
          });
        }
      );
    }


}
