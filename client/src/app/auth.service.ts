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

  public isAuthenticated() : Boolean {
    let userData = localStorage.getItem('userInfo')
    if(userData && JSON.parse(userData)){
      return true;
    }
    return false;
  }

  public setUserInfo(user){
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public getUserDetails(username, password) {
    return this.http.post('/api/login', {
      username,
      password
    }).toPromise()
  };

  public registerUser(userdata) {
    return this.http.post('/api/register', userdata, {
      responseType: 'text'
    }).toPromise();
  }

  public logout(){
    localStorage.removeItem('userInfo');
    localStorage.clear();
    return this.http.get('/api/logout', {
      responseType: 'text'
    }).toPromise()
  }

  public createPost(postData){
    return this.http.post("/api/post", postData, {
      withCredentials: true,
      responseType: 'text'
    }).toPromise();
  }

  public createImagePost(postData){
    const formData = new FormData();
    formData.append('image', postData.file);
    formData.append('message', postData.message);
    formData.append('scheduleTime', postData.scheduleTime);
    return this.http.post("/api/post", formData, {
      withCredentials: true,
      responseType: 'text'
    }).toPromise();
  }

  public listAllPosts(){
    return this.http.get("/api/post", {
      withCredentials: true,
      responseType: 'text'
    }).toPromise();
  }

  public deletePost(postId){
    return this.http.delete(`/api/post/${postId}`, {
      withCredentials: true,
      responseType: 'text'
    }).toPromise();
  }

  public editPost(postId, message){
    const patchData = {
      message:message
    }
    return this.http.patch(`/api/post/${postId}`, patchData, {
      withCredentials: true,
      responseType: 'text'
    }).toPromise();
  }
}