import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators'
import { Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {

  websocket: Subject<any>

  // Events
  newMessage = new Subject<{ threadId: String, message: Message }>()
  threadDeleted = new Subject<String>()
  titleUpdated = new Subject<{ threadId: String, newTitle: String }>()

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    websocketService: WebsocketService
  ) {
    this.websocket = <Subject<any>>websocketService.connect()
    this.websocket.subscribe((data: { threadId: String, message: Message }) => {
      // Only trigger if sender is not this user otherwise duplicate events triggerd
      if (this.authService.userId !== data.message.sender._id) {
        this.newMessage.next({ threadId: data.threadId, message: data.message })
      }
    })
  }

  fetchThreads() {
    return this.httpClient.get<any>(`${environment.apiUrl}/threads`, {
      headers: this.getHeaders()
    })
  }

  fetchThread(id: String) {
    return this.httpClient.get<any>(`${environment.apiUrl}/threads/${id}`, {
      headers: this.getHeaders()
    })
  }

  createThread(directThread) {
    return this.httpClient.post(`${environment.apiUrl}/threads`, directThread, {
      headers: this.getHeaders()
    })
  }

  createGroup(group) {
    return this.httpClient.post(`${environment.apiUrl}/threads`, group, {
      headers: this.getHeaders()
    })
  }

  deleteThread(id: String) {
    return this.httpClient.delete(`${environment.apiUrl}/threads/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      // Trigger event
      tap(() => this.threadDeleted.next(id))
    )
  }

  updateTitle(threadId: String, title: String) {
    return this.httpClient.put(`${environment.apiUrl}/threads/${threadId}`, { title: title }, {
      headers: this.getHeaders()
    }).pipe(
      // Trigger event
      tap(() => this.titleUpdated.next({ threadId: threadId, newTitle: title }))
    )
  }

  updateParticipants(threadId: String, participants: String[]) {
    return this.httpClient.put(`${environment.apiUrl}/threads/${threadId}/users`, { participants: participants }, {
      headers: this.getHeaders()
    })
  }

  sendMessage(newMsg: { content: String, threadId: String }) {
    return this.httpClient.post(`${environment.apiUrl}/threads/${newMsg.threadId}/messages`, { content: newMsg.content }, {
      headers: this.getHeaders()
    }).pipe(
      // Trigger event
      tap(() => {
        const message = new Message()
        message.content = newMsg.content
        message.sender._id = this.authService.userId
        this.newMessage.next({ threadId: newMsg.threadId, message })
      })
    )
  }

  deleteMessage(threadId: String, messageId: String) {
    return this.httpClient.delete(`${environment.apiUrl}/threads/${threadId}/messages/${messageId}`, {
      headers: this.getHeaders()
    })
  }

  private getHeaders() {
    return new HttpHeaders({
      'x-auth-token': this.authService.token.toString()
    })
  }

}
