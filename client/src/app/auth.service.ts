import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  getUserDetails(username, password) {
    return this.http.post('/api/login', {
      username,
      password
    }, {
      responseType: 'text'
    }).subscribe(data => {
      this.router.navigate(['/dashboard'])
    }, (error) => {
      if (error.error == 'Unauthorized') {
        window.alert("User not registered");
      } else {
        console.log(error)
        window.alert(error.error);
      }
    })
  }

  registerUser(userdata) {
    return this.http.post('/api/register', userdata, {
      responseType: 'text'
    }).subscribe(data => {
      this.router.navigate(['/login'])
    }, (error) => {
      if (error.error.includes('Please fill a valid email address')) {
        window.alert('Invalid email address');
      } else if (error.error.includes('duplicate key error') && error.error.includes('index: email')) {
        window.alert('A user with the given email is already registered');
      } else {
        window.alert(error.error);
      }
    })
  }
}