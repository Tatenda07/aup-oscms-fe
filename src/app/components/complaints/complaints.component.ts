import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/shared/services/student.service';
import { ComplaintService } from 'src/app/shared/services/complaint.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css'],
  providers: [ComplaintService]
})
export class ComplaintsComponent implements OnInit {
  complaints: any;
  studentProfile: any;
  sentimentRating: any;

  constructor(
    public complaintService: ComplaintService,
    private notificationService : NotificationService,
    private studentService: StudentService,
    private router: Router,
  ) { }

  serverErrorMessages!: string;

  ngOnInit() {
    this.resetcomplaintForm();
    this.studentService.getStudentProfile().subscribe((res: any) => {
      this.studentProfile = res['studentProfile']
    });
  }

  // reset complaints form
  resetcomplaintForm(form ?: NgForm) {
    if (form)
      form.reset();

    this.complaintService.selectedComplaint = {
      _id: '',
      student_id: '',
      student_name: '',
      complaint_header: '',
      complaint_body: '',
      category: '',
      complaint_status: 0,
      moderated_by: undefined,
      FAQ: 0,
      resolution_id: '',
      createdAt: '',
      updatedAt: ''
    }
  }

  // Natural Language Processing and Sentiment Analysis
  analyzeSentient() {
    document.getElementById('complaint_body')!.addEventListener('keyup', event => {
      /* The event only triggers when . (period) or ? (question mark) or ! (exclamation mark) is pressed.
         In other words, the event is triggered at the end of every sentence, NLP and Sentiment Analysis
         analyzes the concern sentence by sentence.
        (limitation: NLP and Sentiment Analysis is only applied if a period, question mark, or exclamation mark is added at the end of the sentence)
      */
      if (event.code === 'Period' || event.keyCode === 191 && event.shiftKey || event.keyCode === 49 && event.shiftKey) {
        event.preventDefault();
        const review = (<HTMLInputElement>document.getElementById('complaint_body')).value;
        const options = {
          method: 'POST',
          body: JSON.stringify({ review }),
          headers: new Headers({ 'Content-Type': 'application/json' })
        }

        const emojiSection = document.getElementById('emojiSection');

        fetch('https://aup-oscms.herokuapp.com/api/nlp/s-analyzer', options) // local backend fetch url: http://localhost:5000/api/nlp/s-analyzer
          .then(res => res.json())
          .then (({ analysis }) => {
            this.sentimentRating = analysis;
          })
          .catch(err => {
            emojiSection!.innerHTML = 'There was an error analyzing your sentiment!'
          })
      }
    })
  }

  // submit concern
  onSubmitComplaint(form : NgForm) {
    // automatically attach student name and id to the complaint
    form.value.student_name = this.studentProfile.first_name + ' ' + this.studentProfile.last_name;
    form.value.student_id = this.studentProfile.student_id;
    // add new complaint
    this.complaintService.postComplaint(form.value).subscribe({
      next: (res) => {
        this.resetcomplaintForm(form);
        this.notificationService.showSuccess("Concern has been submitted successfully", "Concerns Management");
        this.router.navigateByUrl('/my-concerns');
      },
      error: (err) => {
        if (err.status === 0) {
          this.serverErrorMessages = 'Server connection failed. Please check your internet connection.'
        } else {
          this.serverErrorMessages = err.error.message;
        }
        this.notificationService.showError(this.serverErrorMessages, "Concerns Management Error")
      }
    });

  }

}
