import { User } from "./user";

export class Message {

    public _id: String
    public content: String
    public dateTime: Date
    public sender: User = new User()

}