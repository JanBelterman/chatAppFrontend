import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ThreadsService } from '../../services/threads.service';
import { Thread } from 'src/app/models/thread';
import { UsersService } from 'src/app/services/users.service';
import { Participant } from 'src/app/models/participant';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-groupusers',
  templateUrl: './groupusers.component.html',
  styleUrls: ['./groupusers.component.css']
})
export class GroupusersComponent implements OnInit {

  faReturn = faChevronLeft
  faSubmit = faChevronRight

  private threadId: String

  threadPartId: any[] = []

  participants: Participant[] = []
  notParticipants: Participant[] = []

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadsService,
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.threadId = params['id'] // Set thread id for return
      this.threadService.fetchThread(this.threadId).subscribe((thread: Thread) => { // Fetch thread WAIT
        this.threadPartId = thread.participants // TODO: fix this // Set threads participants
        this.usersService.fetchUsers().subscribe((user: Participant) => { // Fetch user WAIT
          let toAdd: boolean = false
          for (const part of this.threadPartId) {
            if (part._id.toString() === user._id.toString()) {
              toAdd = true
            }
          }
          if (toAdd) {
            this.participants.push(user)
          } else {
            this.notParticipants.push(user)
          }
        })
      })
    })
  }

  onReturn() {
    this.router.navigate([`/chats/${this.threadId}`])
  }

  onParticipantSelect(index: number) {
    // Add user
    const move = this.participants[index]
    this.participants.splice(index, 1)
    this.notParticipants.push(move)
  }

  onNotParticipantSelect(index: number) {
    // Remove user
    const move = this.notParticipants[index]
    this.notParticipants.splice(index, 1)
    this.participants.push(move)
  }

  onSubmit() {
    // Send put request with new user list
    let partici: String[] = []
    for (const part of this.participants) {
      partici.push(part._id)
    }
    this.threadService.updateParticipants(this.threadId, partici).subscribe(() => {
      this.router.navigate([`/chats/${this.threadId}`])
    })
  }

}
