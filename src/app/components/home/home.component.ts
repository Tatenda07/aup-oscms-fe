import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/shared/services/student.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  studentProfile: any;

  constructor(
    private studentService: StudentService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.studentService.getStudentProfile().subscribe((res: any) => {
      this.studentProfile = res['studentProfile']
    });
  }

}

function talk(){  
  var know = {  
   "Who are you" : "Hello, Codewith_random here 💙",  
   "How are you" : "Good :)",  
   "What can i do for you" : "Please Give us A Follow & Like.",  
   "Your followers" : "I have my family of 5000 members, i don't have follower ,have supportive Famiy👪 ",  
   "ok" : "Thank You So Much ",  
   "Bye" : "Okay! Will meet soon.."  
  };  
  var user = document.getElementById('userBox').value;  
   document.getElementById('chatLog').innerHTML = user + "<br>";  
  if (user in know) {  
   document.getElementById('chatLog').innerHTML = know[user] + "<br>";  
  }else{  
   document.getElementById('chatLog').innerHTML = "Sorry,I didn't understand <br>";  
  }  
 }  

