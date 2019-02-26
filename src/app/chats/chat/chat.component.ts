import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ThreadsService } from '../../services/threads.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { faArrowRight, faTrash, faEdit, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { Thread } from 'src/app/models/thread';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  // Scrollable container
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  // Icons
  sendIcon = faArrowRight
  deleteIcon = faTrash
  updateIcon = faEdit
  usersUpdate = faUsersCog
  // Forms
  newmsgForm: FormGroup = new FormGroup({
    content: new FormControl(null, [Validators.required])
  })
  updateTitleForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required])
  })

  // Domain objects
  thread: Thread
  userId: String

  // Updating state
  updating: boolean = false

  newMessageSub: Subscription

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private threadService: ThreadsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.thread = new Thread()
    this.userId = this.authService.userId
    // Subscribe to switching thread events
    this.route.params.subscribe((params: Params) => {
      this.thread._id = params['id']
      this.threadService.fetchThread(this.thread._id).subscribe((thread: Thread) => {
        this.thread = thread
        this.scrollToBottom()

        // Subscribe to new message event
        this.newMessageSub = this.threadService.newMessage.subscribe((update: any) => {
          if (this.thread._id === update.threadId && update.message.sender._id !== this.userId) {
            thread.messages.push(update.message)
            this.scrollToBottom()
          }
        })
      })
    })

    // Cancel updating when switching threads
    this.router.events.subscribe(() => this.updating = false)
  }

  onSubmitMessage() {
    // Send message
    this.threadService.sendMessage({
      content: this.newmsgForm.value['content'],
      threadId: this.thread._id
    }).subscribe((response: any) => {
      this.newmsgForm.reset()
      // Create new message
      const newMsg = new Message()
      newMsg.sender._id = this.authService.userId
      newMsg.content = response.content
      newMsg.dateTime = response.dateTime
      newMsg._id = response._id
      this.thread.messages.push(newMsg)
      this.scrollToBottom()
    })
  }

  onDeleteMessage(indexOfMessage: number, messageId: String) {
    this.threadService.deleteMessage(this.thread._id, messageId).subscribe(() => {
      this.thread.messages.splice(indexOfMessage, 1)
    })
  }

  onDeleteThread() {
    this.threadService.deleteThread(this.thread._id).subscribe()
  }

  onUpdateTitle() {
    this.updating = !this.updating
    this.updateTitleForm.setValue({ title: this.thread.title })
  }

  onSubmitTitleUpdate() {
    const newTitle = this.updateTitleForm.value['title']
    this.threadService.updateTitle(this.thread._id, newTitle).subscribe(() => {
      this.updateTitleForm.reset()
      this.thread.title = newTitle
      this.updating = false
    })
  }

  onUpdateUsers() {
    this.router.navigate([`/groupusers/${this.thread._id}`])
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.newMessageSub.unsubscribe()
    this.updating = false
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
