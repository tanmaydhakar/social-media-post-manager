import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private Auth: AuthService, private router : Router) { }

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

    this.Auth.registerUser(userData).then((response) => {
      this.router.navigate(['/login'])
    }, (error) => {
      if (error.error.includes('Please fill a valid email address')) {
        window.alert('Invalid email address');
      } else if (error.error.includes('duplicate key error') && error.error.includes('index: email')) {
        window.alert('A user with the given email is already registered');
      } else {
        window.alert(error.error);
      }
    });
  }
}
