import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private Auth: AuthService, private router: Router) {}
  postsData: any

  ngOnInit(): void {
    this.Auth.listAllPosts().then((response) => {
      response = JSON.parse(response);
      this.postsData = response;
    }, (error) => {
      console.log(error.error);
    })
  }
  showDiv = {
    schedulepost: true,
    schedulephoto: false,
    scheduledposts: false
  }

  onSubmit(form: NgForm) {
    if (form.value.message == '') {
      window.alert('Message cant be empty');
    } else if (form.value.datetime == '') {
      window.alert('Please select a schedule time to continue');
    } else if (new Date(form.value.datetime).getTime() - new Date().getTime() < 20 * 60 * 1000 || new Date(form.value.datetime).getTime() - new Date().getTime() > 75 * 4 * 60 * 1000) {
      window.alert('Post can be scheduled for minimum 20 mins ahead and maximum of 75 days ahead');
    } else {
      const postData = {
        message: form.value.message,
        scheduleTime: form.value.datetime
      };

      this.Auth.createPost(postData).then((response) => {
        window.alert(response);
        window.location.reload();
      }).catch((error) => {
        window.alert(error.error);
      });
    }
  }

  selectedFile = null;
  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  imgSubmit(form: NgForm) {
    if (form.value.datetime == '') {
      window.alert('Please select a schedule time to continue');
    } else if (!this.selectedFile) {
      window.alert('Please upload a image file');
    } else {
      const postData = {
        message: form.value.caption ? form.value.caption : '',
        scheduleTime: form.value.datetime,
        file: this.selectedFile
      };

      this.Auth.createImagePost(postData).then((response) => {
        window.alert(response);
        window.location.reload();
      }).catch((error) => {
        window.alert(error.error);
      });
    }
  }

  listAllPosts() {
    this.Auth.listAllPosts().then((response) => {
      console.log(response)
    }, (error) => {
      window.alert(error.error);
    });
  }

   logout() {
    this.Auth.logout().then((response) => {
      this.router.navigate(['/'])
    }, (error) => {
      window.alert(error.error);
    });
  }

  editPost(dataObject, form) {
    if (!form.value || !form.value.message) {
      window.alert('Message cant be empty');
    } else {
      this.Auth.editPost(dataObject._id, form.value.message).then((response) => {
        window.alert(response);
        window.location.reload();
      }, (error) => {
        window.alert(error.error);
      });
    }
  }

  deletePost(dataObject) {
    this.Auth.deletePost(dataObject._id).then((response) => {
      window.alert(response);
      window.location.reload();
    }, (error) => {
      window.alert(error.error);
    });
  }
}
