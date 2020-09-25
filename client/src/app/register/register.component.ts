import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private Auth: AuthService) { }

  ngOnInit(): void {
  }

  registerUser(event){
    event.preventDefault()
    const target = event.target

    const userData = {
      username: target.querySelector('#username').value,
      password: target.querySelector('#password').value,
      email: target.querySelector('#email').value
    }

    this.Auth.registerUser(userData);
  }
}
