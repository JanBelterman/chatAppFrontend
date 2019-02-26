import { Message } from "./message"
import { User } from "./user"

export class Thread {

    public _id: String
    public type: String
    public lastActivity: Date
    public lastMessage: Message
    public messages: Message[] = []
    public participants: String[] = []

    // Group threads only
    public title: String
    public description: String
    public owner: User = new User()

}