import { Thread } from "src/app/models/thread";

export class ThreadListItem {

    constructor(
        public thread: Thread
    ) { }

    optionsButtonShown: boolean = false

}