import { Component, OnInit } from '@angular/core';
import { Participant } from 'src/app/models/participant';
import { UsersService } from 'src/app/services/users.service';
import { ThreadsService } from '../../services/threads.service';
import { Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  users: Participant[] = []

  faReturn = faChevronLeft

  constructor(
    private usersService: UsersService,
    private threadsService: ThreadsService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get users
    this.usersService.fetchUsers().subscribe((users: Participant) => {
      this.users.push(users)
    })
  }

  onSelect(userId: String) {
    // Create direct thread
    const directThread = {
      type: 'direct',
      participants: [userId.toString()]
    }
    // Navigate back when done
    this.threadsService.createThread(directThread).subscribe(() => this.router.navigate(['/chats']))
  }

}
