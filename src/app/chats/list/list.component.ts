import { Component, OnInit, OnDestroy } from '@angular/core'
import { ThreadsService } from '../../services/threads.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { faUser, faUsers, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { Thread } from 'src/app/models/thread'
import { AuthService } from 'src/app/services/auth.service';
import { concatAll, map } from 'rxjs/operators';
import { ThreadListItem } from './threadListItem';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  // Icons
  createDirectIcon = faUser
  createGroupIcon = faUsers
  optionsButtonIcon = faCaretDown

  // Domain data
  threadListItems: ThreadListItem[] = []
  userId: String

  // Event subscriptions
  private newMessageSub: Subscription
  private threadDeletedSub: Subscription
  private titleUpdateSub: Subscription

  // Active thread
  private activeThreadId: String

  constructor(
    private threadsService: ThreadsService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get threads & userId
    this.userId = this.authService.userId
    this.threadsService.fetchThreads().pipe(
      concatAll(),
      map((thread: Thread) => { return new ThreadListItem(thread) })
    ).subscribe((threadListItem: ThreadListItem) => {
      this.threadListItems.push(threadListItem)
      if (this.threadListItems.length === 1) {
        this.router.navigate([`/chats/${this.threadListItems[0].thread._id}`])
        this.activeThreadId = this.threadListItems[0].thread._id
      }
    })

    // Subscribe to events
    this.newMessageSub = this.threadsService.newMessage.subscribe((update: any) => {
      // Move thread to first in list and update last message
      let threadToMove
      let i = 0
      for (const threadListItem of this.threadListItems) {
        if (threadListItem.thread._id === update.threadId) {
          if (update.content !== '') {
            threadListItem.thread.lastMessage = update.message
          }
          threadToMove = threadListItem
          break;
        }
        i++
      }
      this.threadListItems.splice(i, 1)
      this.threadListItems.unshift(threadToMove)
    })

    this.threadDeletedSub = this.threadsService.threadDeleted.subscribe((threadId: String) => {
      // Delete thread from this list
      let i = 0
      for (const threadListItem of this.threadListItems) {
        if (threadListItem.thread._id === threadId) {
          this.threadListItems.splice(i, 1)
          break
        }
        i++
      }
      // Redirect if chat was selected
      if (this.activeThreadId === threadId) {
        if (this.threadListItems.length === 0) this.router.navigate(['/chats'])
        else {
          this.router.navigate([`/chats/${this.threadListItems[0].thread._id}`])
          this.activeThreadId = this.threadListItems[0].thread._id
        }
      }
    })

    this.titleUpdateSub = this.threadsService.titleUpdated.subscribe((titleChange: any) => {
      for (const threadListItem of this.threadListItems) {
        if (threadListItem.thread._id === titleChange.threadId) {
          threadListItem.thread.title = titleChange.newTitle
          break;
        }
      }
    })

  }

  showOptionsButton(index: number) { this.threadListItems[index].optionsButtonShown = true }

  hideOptionsButton(index: number) { this.threadListItems[index].optionsButtonShown = false }

  onSelectThread(id: String) { this.activeThreadId = id }

  // Unsubscribe from events
  ngOnDestroy() {
    this.newMessageSub.unsubscribe()
    this.threadDeletedSub.unsubscribe()
    this.titleUpdateSub.unsubscribe()
  }

  // Router events
  onCreateDirect() { this.router.navigate(['/newchat']) }
  onCreateGroup() { this.router.navigate(['/createGroup']) }

}