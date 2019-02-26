import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Participant } from 'src/app/models/participant';
import { UsersService } from 'src/app/services/users.service';
import { ThreadsService } from '../../services/threads.service';
import { Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrls: ['./creategroup.component.css']
})
export class CreategroupComponent implements OnInit {

  faReturn = faChevronLeft

  users: String[] = []

  userso: Participant[] = []

  createForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required])
  })

  constructor(
    private usersService: UsersService,
    private threadsService: ThreadsService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get users
    this.usersService.fetchUsers().subscribe((users: Participant) => {
      this.userso.push(users)
    })
  }

  onSelect(id: String, i: number) {
    // Add user to participants
    this.users.push(id)
    this.userso.splice(i, 1)
  }

  onSubmit() {
    // Create group
    const groupThread = {
      type: 'group',
      title: this.createForm.value['title'],
      description: this.createForm.value['description'],
      participants: this.users
    }
    // Navigate back when done
    this.threadsService.createGroup(groupThread).subscribe(() => this.router.navigate(['/chats']))
  }

}
