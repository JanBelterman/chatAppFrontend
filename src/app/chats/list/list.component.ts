import { Component, OnInit, OnDestroy } from '@angular/core'
import { ThreadsService } from '../../services/threads.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Thread } from 'src/app/models/thread'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  createOne = faUser
  createMany = faUsers

  threads: Thread[] = []
  userId: String

  private newMessageSub: Subscription
  private threadDeletedSub: Subscription
  private titleUpdateSub: Subscription

  private currentThreadId: String

  constructor(
    private threadsService: ThreadsService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get threads & userId
    this.userId = this.authService.userId
    this.threadsService.fetchThreads().subscribe((threads: Thread[]) => {
      this.threads = threads
      if (this.threads.length > 0) {
        this.router.navigate([`/chats/${this.threads[0]._id}`])
        this.currentThreadId = this.threads[0]._id
      }
    })

    // Subscribe to events
    this.newMessageSub = this.threadsService.newMessage.subscribe((update: any) => {
      // Move thread to first in list and update last message
      let threadToMove
      let i = 0
      for (const thread of this.threads) {
        if (thread._id === update.threadId) {
          if (update.content !== '') {
            thread.lastMessage = update.message
          }
          threadToMove = thread
          break;
        }
        i++
      }
      this.threads.splice(i, 1)
      this.threads.unshift(threadToMove)
    })

    this.threadDeletedSub = this.threadsService.threadDeleted.subscribe((threadId: String) => {
      // Delete thread from this list
      let i = 0
      for (const thread of this.threads) {
        if (thread._id === threadId) {
          this.threads.splice(i, 1)
          break
        }
        i++
      }
      // Redirect if chat was selected
      if (this.currentThreadId === threadId) {
        if (this.threads.length === 0) this.router.navigate(['/chats'])
        else {
          this.router.navigate([`/chats/${this.threads[0]._id}`])
          this.currentThreadId = this.threads[0]._id
        }
      }
    })

    this.titleUpdateSub = this.threadsService.titleUpdated.subscribe((titleChange: any) => {
      for (const thread of this.threads) {
        if (thread._id === titleChange.threadId) {
          thread.title = titleChange.newTitle
          break;
        }
      }
    })

  }

  onSelect(id: String) {
    this.currentThreadId = id
  }

  ngOnDestroy() {
    this.newMessageSub.unsubscribe()
    this.threadDeletedSub.unsubscribe()
    this.titleUpdateSub.unsubscribe()
  }

  onCreate() {
    this.router.navigate(['/newchat'])
  }

  onCreateGroup() {
    this.router.navigate(['/createGroup'])
  }

}
